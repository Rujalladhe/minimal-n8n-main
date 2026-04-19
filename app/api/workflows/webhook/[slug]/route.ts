import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkflowExecutor } from "@/lib/executor";
import { WorkflowNode, WorkflowEdge } from "@/lib/types";
import fs from "fs";
import path from "path";

// Load client registry
function loadClients(): Record<string, any> {
    try {
        const clientsPath = path.join(process.cwd(), "config", "clients.json");
        const raw = fs.readFileSync(clientsPath, "utf-8");
        return JSON.parse(raw);
    } catch (e) {
        console.warn("Could not load clients.json, client validation disabled");
        return {};
    }
}

// Normalize domain: strip https://, http://, www., trailing slashes
function normalizeDomain(domain: string): string {
    if (!domain) return domain;
    return domain
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/\/+$/, "")
        .trim()
        .toLowerCase();
}

// CORS headers for embeddable form cross-origin requests
function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Key",
        "Access-Control-Max-Age": "86400",
    };
}

// Handle CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(),
    });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    return handleWebhook(request, slug);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    return handleWebhook(request, slug);
}

async function handleWebhook(request: NextRequest, slug: string) {
    try {
        const origin = request.nextUrl.origin;
        const webhookPath = `/${slug}`; // e.g., /generate

        // 1. Parse Input Body (if POST) or Params (if GET)
        let inputData: any = {};
        try {
            const contentType = request.headers.get("content-type");
            if (request.method === "POST" && contentType?.includes("application/json")) {
                inputData = await request.json();
            } else {
                const url = new URL(request.url);
                inputData = Object.fromEntries(url.searchParams.entries());
            }
        } catch (e) {
            console.warn("Failed to parse input data", e);
        }

        // 2. Client key validation (for lead pipeline forms)
        if (inputData.client_key) {
            const clients = loadClients();
            const clientInfo = clients[inputData.client_key];
            if (!clientInfo) {
                console.warn(`Invalid client_key: ${inputData.client_key}`);
                return NextResponse.json(
                    { error: "Invalid client key" },
                    { status: 403, headers: corsHeaders() }
                );
            }
            console.log(`[Lead Pipeline] Client: ${clientInfo.name} (${inputData.client_key}), Source: ${inputData.sourceUrl || "unknown"}, Time: ${new Date().toISOString()}`);
        }

        // 3. Normalize domain if present
        if (inputData.domain) {
            inputData.domain = normalizeDomain(inputData.domain);
        }

        // 4. Fetch all workflows
        const workflows = await prisma.workflow.findMany();

        let targetWorkflow = null;
        let targetTriggerNode: WorkflowNode | null = null;
        let nodes: WorkflowNode[] = [];
        let edges: WorkflowEdge[] = [];

        // 5. Find the matching workflow
        for (const workflow of workflows) {
            const parsedNodes: WorkflowNode[] = JSON.parse(workflow.nodes);

            const trigger = parsedNodes.find(
                (n) =>
                    n.data.type === "webhook" &&
                    (n.data.config?.path === webhookPath || n.data.config?.path === slug)
            );

            if (trigger) {
                targetWorkflow = workflow;
                targetTriggerNode = trigger;
                nodes = parsedNodes;
                edges = JSON.parse(workflow.edges);
                break; // Match found
            }
        }

        if (!targetWorkflow || !targetTriggerNode) {
            return NextResponse.json(
                { error: `No workflow found for webhook path: ${webhookPath}` },
                { status: 404, headers: corsHeaders() }
            );
        }

        console.log(`Executing Workflow: ${targetWorkflow.name} (${targetWorkflow.id})`);

        // 6. Prepare Execution
        const executor = new WorkflowExecutor(origin);
        const executionResults: Record<string, any> = {};
        const executedNodeIds = new Set<string>();

        // 7. Initial Trigger Execution (Pass input data)
        executionResults[targetTriggerNode.id] = {
            body: inputData,
            headers: Object.fromEntries(request.headers.entries()),
            query: Object.fromEntries(new URL(request.url).searchParams.entries()),
            timestamp: new Date().toISOString(),
            // Flatten lead form fields for easy template access
            ...inputData,
        };
        executedNodeIds.add(targetTriggerNode.id);

        // Queue of nodes to execute
        const queue: string[] = [];

        // Add children of trigger to queue
        const initialChildren = edges
            .filter(e => e.source === targetTriggerNode!.id)
            .map(e => e.target);
        queue.push(...initialChildren);

        // Process Queue
        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            if (executedNodeIds.has(nodeId)) continue; // Avoid cycles or double execution

            const node = nodes.find(n => n.id === nodeId);
            if (!node) continue;

            // Get input from previous nodes (simple aggregation)
            const incomingEdges = edges.filter(e => e.target === nodeId);
            const previousOutputs: Record<string, any> = {};

            // Wait for all parents to be executed? 
            const allParentsExecuted = incomingEdges.every(e => executedNodeIds.has(e.source));

            if (!allParentsExecuted) {
                // Push back to end of queue to retry later
                queue.push(nodeId);
            }

            // Collect inputs
            incomingEdges.forEach(e => {
                if (executionResults[e.source]) {
                    previousOutputs[e.source] = executionResults[e.source];
                }
            });

            // Build a rich context:
            const primaryParentId = incomingEdges[0]?.source;
            const primaryInput = primaryParentId ? executionResults[primaryParentId] : inputData;

            const richContext = {
                ...inputData,      // Support {{body.topic}}
                ...executionResults, // Support {{node-4.generatedText}}
                ...(primaryInput || {}), // Support {{generatedText}} directly
                input: primaryInput // Support {{input.generatedText}}
            };

            console.log(`Executing node: ${node.data.label} (${node.id})`);

            try {
                const result = await executor.executeNode({
                    nodeId: node.id,
                    input: richContext,
                    config: node.data.config || {},
                    previousNodes: previousOutputs
                });

                if (result.success) {
                    executionResults[node.id] = result.output;
                    executedNodeIds.add(node.id);

                    // Add children
                    const children = edges
                        .filter(e => e.source === nodeId)
                        .map(e => e.target);
                    queue.push(...children);
                } else {
                    console.error(`Node ${node.id} failed: ${result.error}`);
                }
            } catch (err) {
                console.error(`Execution error at ${node.id}:`, err);
            }
        }

        // 8. Save latest execution state back to the workflow so it's visible in the editor UI
        const updatedNodes = nodes.map(node => {
            if (executionResults[node.id]) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        output: executionResults[node.id]
                    }
                };
            }
            return node;
        });

        await prisma.workflow.update({
            where: { id: targetWorkflow.id },
            data: { nodes: JSON.stringify(updatedNodes) }
        });

        // 9. Return Response with CORS headers
        return NextResponse.json({
            success: true,
            message: "Workflow executed successfully",
            executionResults
        }, { headers: corsHeaders() });

    } catch (error: any) {
        console.error("Webhook Execution Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500, headers: corsHeaders() }
        );
    }
}

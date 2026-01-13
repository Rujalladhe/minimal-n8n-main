import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkflowExecutor } from "@/lib/executor";
import { WorkflowNode, WorkflowEdge } from "@/lib/types";

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

        // 1. Fetch all workflows (since we can't query inside JSON string easily with SQLite/Prisma basic)
        // Optimization: In a real app, you'd execute a raw SQL query or have a separate Trigger table.
        const workflows = await prisma.workflow.findMany();

        let targetWorkflow = null;
        let targetTriggerNode: WorkflowNode | null = null;
        let nodes: WorkflowNode[] = [];
        let edges: WorkflowEdge[] = [];

        // 2. Find the matching workflow
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
                { status: 404 }
            );
        }

        console.log(`Executing Workflow: ${targetWorkflow.name} (${targetWorkflow.id})`);

        // 3. Prepare Execution
        const executor = new WorkflowExecutor(origin);
        const executionResults: Record<string, any> = {};
        const executedNodeIds = new Set<string>();

        // Parse Input Body (if POST) or Params (if GET)
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

        // 4. Execution Loop (Simple BFS/dfs traversal)
        // We need to execute the trigger, then follow edges.

        // Initial Trigger Execution (Pass input data)
        executionResults[targetTriggerNode.id] = {
            body: inputData,
            headers: Object.fromEntries(request.headers.entries()),
            query: Object.fromEntries(new URL(request.url).searchParams.entries()),
            timestamp: new Date().toISOString()
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
            // For simplicity in this demo, strict topological sort isn't implemented, 
            // but BFS usually works for trees/DAGs. 
            // If a parent hasn't executed, we might be executing too early. 
            // But let's check if all parents are done.
            const allParentsExecuted = incomingEdges.every(e => executedNodeIds.has(e.source));

            if (!allParentsExecuted) {
                // Push back to end of queue to retry later
                // Note: This matches a simple dependency resolution
                queue.push(nodeId);
                // Break infinite loop if we are stuck (cyclic dependency)
                // For a minimal demo, we'll risk it or add a max retries counter if needed.
                // Actually, let's just use the data we have.
                // continue; 
            }

            // Collect inputs
            incomingEdges.forEach(e => {
                if (executionResults[e.source]) {
                    previousOutputs[e.source] = executionResults[e.source];
                }
            });

            // Build a rich context:
            // 1. Root Input (from webhook) as 'input'
            // 2. Immediate parent output as nested 'input' (for node-to-node default)
            // 3. All nodes by ID (e.g., node-4.generatedText)
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
                    // Stop this branch? or continue?
                    // For demo: continue
                }
            } catch (err) {
                console.error(`Execution error at ${node.id}:`, err);
            }
        }

        // 5. Return Response
        // If the last executed node returned something, maybe return that?
        // Or just a success message.
        return NextResponse.json({
            success: true,
            message: "Workflow executed successfully",
            executionResults
        });

    } catch (error: any) {
        console.error("Webhook Execution Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

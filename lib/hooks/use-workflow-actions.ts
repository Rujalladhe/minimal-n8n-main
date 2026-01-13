import { useWorkflowStore } from '@/lib/store';
import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';

export interface WorkflowSummary {
    id: string;
    name: string;
    updatedAt: string;
    createdAt: string;
}

export function useWorkflowActions() {
    const { nodes, edges, setWorkflow, currentWorkflowId, setCurrentWorkflowId } = useWorkflowStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to handle API calls
    const fetchWithAuth = async (url: string, options?: RequestInit) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch(url, options);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }
            return await res.json();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const saveWorkflow = useCallback(async (name: string) => {
        // If we have an ID, update; otherwise create
        // BUT user name might change. If it's "Save As" (new name), we should create new?
        // For simplicity: If currentWorkflowId exists, update it. If name allows editing, we pass it.
        // If we want "Save As" functionality, we needs explicit flag.
        // Let's assume generic "Save":
        // If ID exists -> PUT.
        // If ID null -> POST.

        // We need to serialize nodes/edges
        // ReactFlow nodes/edges are objects. API expects stringified JSON (as per our schema decision, or actually just JSON object if content-type is json).
        // Wait, API route `createWorkflowSchema` expects `nodes: z.string()`.
        // So we MUST stringify.

        const payload = {
            name,
            nodes: JSON.stringify(nodes),
            edges: JSON.stringify(edges),
        };

        if (currentWorkflowId) {
            await fetchWithAuth(`/api/workflows/${currentWorkflowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            // Update local state if needed (name might have changed)
        } else {
            const newWorkflow = await fetchWithAuth('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setCurrentWorkflowId(newWorkflow.id);
        }
    }, [nodes, edges, currentWorkflowId, setCurrentWorkflowId]);

    const loadWorkflow = useCallback(async (id: string) => {
        const workflow = await fetchWithAuth(`/api/workflows/${id}`);

        // Parse nodes/edges back to objects
        const parsedNodes = JSON.parse(workflow.nodes);
        const parsedEdges = JSON.parse(workflow.edges);

        setWorkflow(parsedNodes, parsedEdges);
        setCurrentWorkflowId(workflow.id);
        return workflow;
    }, [setWorkflow, setCurrentWorkflowId]);

    const listWorkflows = useCallback(async () => {
        return await fetchWithAuth('/api/workflows');
    }, []);

    const deleteWorkflow = useCallback(async (id: string) => {
        await fetchWithAuth(`/api/workflows/${id}`, {
            method: 'DELETE',
        });

        if (currentWorkflowId === id) {
            setCurrentWorkflowId(null);
            // Optional: clear canvas? Maybe not, just detach ID.
        }
    }, [currentWorkflowId, setCurrentWorkflowId]);

    return {
        saveWorkflow,
        loadWorkflow,
        listWorkflows,
        deleteWorkflow,
        isLoading,
        error,
    };
}

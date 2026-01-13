'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { useWorkflowActions, WorkflowSummary } from '@/lib/hooks/use-workflow-actions';
import { FolderOpen, Trash2, X, Loader2 } from 'lucide-react';


// Checking package.json... date-fns is not listed.
// I will implement a simple date formatter.

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function WorkflowListDialog() {
    const [open, setOpen] = React.useState(false);
    const { listWorkflows, loadWorkflow, deleteWorkflow, isLoading } = useWorkflowActions();
    const [workflows, setWorkflows] = React.useState<WorkflowSummary[]>([]);
    const [loadingList, setLoadingList] = React.useState(false);

    const fetchWorkflows = React.useCallback(async () => {
        setLoadingList(true);
        try {
            const data = await listWorkflows();
            setWorkflows(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingList(false);
        }
    }, [listWorkflows]);

    React.useEffect(() => {
        if (open) {
            fetchWorkflows();
        }
    }, [open, fetchWorkflows]);

    const handleLoad = async (id: string) => {
        try {
            await loadWorkflow(id);
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this workflow?')) return;
        try {
            await deleteWorkflow(id);
            fetchWorkflows();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant="outline" className="gap-2 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] hover:bg-[#2a2a2a]">
                    <FolderOpen className="h-4 w-4" />
                    Load
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-6 shadow-xl duration-200 z-50 flex flex-col">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-[#e5e5e5]">
                            Load Workflow
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-[#999999]">
                            Select a workflow to load into the canvas.
                        </Dialog.Description>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[300px] custom-scrollbar">
                        {loadingList ? (
                            <div className="flex items-center justify-center h-40 text-[#999999]">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                Loading...
                            </div>
                        ) : workflows.length === 0 ? (
                            <div className="flex items-center justify-center h-40 text-[#999999]">
                                No workflows found.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {workflows.map((workflow) => (
                                    <div
                                        key={workflow.id}
                                        className="flex justify-between items-center p-3 rounded-lg border border-[#2a2a2a] hover:bg-[#1a1a1a] cursor-pointer group transition-colors"
                                        onClick={() => handleLoad(workflow.id)}
                                    >
                                        <div>
                                            <div className="font-medium text-[#e5e5e5]">{workflow.name}</div>
                                            <div className="text-xs text-[#666666]">
                                                Last updated {timeAgo(workflow.updatedAt)}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-[#666666] hover:text-red-500 hover:bg-transparent"
                                            onClick={(e) => handleDelete(e, workflow.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-[#999999]">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

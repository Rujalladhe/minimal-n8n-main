'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkflowActions } from '@/lib/hooks/use-workflow-actions';
import { Save, X } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';

export function SaveWorkflowDialog() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const { saveWorkflow, isLoading, error } = useWorkflowActions();
    const { currentWorkflowId } = useWorkflowStore();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        try {
            await saveWorkflow(name);
            setOpen(false);
            setName('');
        } catch (err) {
            console.error(err);
        }
    };

    // If we have an existing workflow, maybe pre-fill the name (if we stored it).
    // But our store only has currentWorkflowId. We might want to fetch the name or just let user type new name.
    // For MVP, letting user type name or reusing generic "My Workflow".

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant="outline" className="gap-2 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] hover:bg-[#2a2a2a]">
                    <Save className="h-4 w-4" />
                    Save
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[425px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-6 shadow-xl duration-200 z-50">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-[#e5e5e5]">
                            Save Workflow
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-[#999999]">
                            Name your workflow to save it to the database.
                        </Dialog.Description>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[#e5e5e5]">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5]"
                                    placeholder="My Workflow"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex justify-end gap-3">
                            <Dialog.Close asChild>
                                <Button variant="outline" type="button" className="bg-transparent border-[#2a2a2a] text-[#999999] hover:bg-[#1a1a1a] hover:text-[#e5e5e5]">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                    <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-[#999999]">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

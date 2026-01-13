"use client";

import React from "react";
import { nodeDefinitions, NodeDefinition } from "@/lib/node-definitions";
import { Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/lib/store";

import { WorkflowListDialog } from "@/components/workflow-list-dialog";

interface SidebarProps {
  onExecute: () => void;
  isExecuting: boolean;
}

export default function Sidebar({ onExecute, isExecuting }: SidebarProps) {
  const { clearWorkflow } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const categories = {
    trigger: "Trigger Nodes",
    ai: "AI Nodes",
    action: "Action Nodes",
    logic: "Logic Nodes",
  };

  const groupedNodes = Object.values(nodeDefinitions).reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodeDefinition[]>);

  return (
    <div className="w-full md:w-72 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#1a1a1a] max-h-[40vh] md:max-h-none md:h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="p-4 border-b border-[#1a1a1a]">
        <h2 className="text-lg font-semibold mb-4 text-[#e5e5e5]">
          Workflow Builder
        </h2>

        <div className="flex gap-2">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e5e5e5] px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 border border-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            {isExecuting ? "Running..." : "Execute"}
          </button>


          <WorkflowListDialog />

          <button
            onClick={clearWorkflow}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#999999] px-3 py-2 rounded text-sm border border-[#2a2a2a] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {Object.entries(categories).map(([category, title]) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-semibold mb-3 text-[#666666] uppercase tracking-wider">
              {title}
            </h3>

            <div className="space-y-1.5">
              {groupedNodes[category]?.map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                  className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded cursor-move hover:bg-[#2a2a2a] hover:border-[#3a3a3a] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-[#2a2a2a] rounded border border-[#3a3a3a] group-hover:bg-[#3a3a3a]">
                      <node.icon className="h-3.5 w-3.5 text-[#e5e5e5]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#e5e5e5]">
                        {node.label}
                      </div>
                      <div className="text-xs text-[#666666] mt-0.5 line-clamp-1">
                        {node.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 p-3 bg-[#1a1a1a] rounded border border-[#2a2a2a]">
          <p className="text-xs text-[#666666] leading-relaxed">
            <span className="text-[#999999] font-medium">Tip:</span> Drag nodes onto the canvas and connect them to create workflows.
          </p>
        </div>
      </div>
    </div>
  );
}

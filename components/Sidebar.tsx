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
    <div className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-[#d1d7db] max-h-[40vh] md:max-h-none md:h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="p-4 border-b border-[#d1d7db] bg-[#f0f2f5]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#128c7e]">Wapzio</h2>
          <p className="text-[10px] text-[#65676b] uppercase tracking-tighter font-medium">Product By Anantkamal Software Labs</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex-1 bg-[#128c7e] hover:bg-[#075e54] text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            {isExecuting ? "Running..." : "Execute"}
          </button>


          <WorkflowListDialog />

          <button
            onClick={clearWorkflow}
            className="bg-white hover:bg-[#f0f2f5] text-[#65676b] px-3 py-2 rounded-lg text-sm border border-[#d1d7db] transition-colors shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {Object.entries(categories).map(([category, title]) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-bold mb-3 text-[#128c7e] uppercase tracking-wider">
              {title}
            </h3>

            <div className="space-y-2">
              {groupedNodes[category]?.map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                  className="p-3 bg-white border border-[#d1d7db] rounded-xl cursor-move hover:border-[#128c7e] hover:shadow-md transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#f0f2f5] rounded-lg border border-[#d1d7db] group-hover:bg-[#e7fce3] group-hover:border-[#25d366] transition-colors">
                      <node.icon className="h-4 w-4 text-[#128c7e]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#1c1e21]">
                        {node.label}
                      </div>
                      <div className="text-xs text-[#65676b] mt-0.5 line-clamp-1">
                        {node.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-[#e7fce3] rounded-xl border border-[#25d366]/20">
          <p className="text-xs text-[#075e54] leading-relaxed">
            <span className="font-bold">Pro Tip:</span> Drag nodes to build your automation. Connect them to define the flow.
          </p>
        </div>
      </div>
    </div>
  );
}

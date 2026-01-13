"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { nodeDefinitions } from "@/lib/node-definitions";
import { WorkflowNode } from "@/lib/types";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function CustomNode({ data, id, selected }: NodeProps<WorkflowNode["data"]>) {
  const definition = nodeDefinitions[data.type];

  if (!definition) return null;

  const Icon = definition.icon;
  const showInput = definition.category !== "trigger";

  // Get category-based colors
  const getCategoryColor = () => {
    switch (definition.category) {
      case "trigger":
        return "bg-[#2a2a2a] border-[#3a3a3a]";
      case "ai":
        return "bg-[#2a2a2a] border-[#3a3a3a]";
      case "action":
        return "bg-[#2a2a2a] border-[#3a3a3a]";
      case "logic":
        return "bg-[#2a2a2a] border-[#3a3a3a]";
      default:
        return "bg-[#2a2a2a] border-[#3a3a3a]";
    }
  };

  return (
    <div
      className={`
        relative bg-[#1a1a1a] rounded-md border transition-all
        ${selected ? "border-[#6a6a6a] shadow-lg shadow-black/50" : "border-[#2a2a2a]"}
        ${data.isExecuting ? "border-[#4a4a4a]" : ""}
        ${data.error ? "border-[#ff4444]" : ""}
        min-w-[220px] max-w-[280px]
      `}
    >
      {/* Input Handle */}
      {showInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-[#2a2a2a] !border-2 !border-[#4a4a4a] hover:!bg-[#4a4a4a]"
        />
      )}

      {/* Node Header */}
      <div className={`${getCategoryColor()} px-3 py-2.5 border-b border-[#1a1a1a] flex items-center gap-2.5`}>
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#e5e5e5]" />
        </div>
        <span className="font-medium text-[#e5e5e5] text-sm flex-1 truncate">
          {definition.label}
        </span>

        <div className="flex-shrink-0">
          {data.isExecuting && (
            <Loader2 className="h-3.5 w-3.5 text-[#999999] animate-spin" />
          )}
          {data.output && !data.isExecuting && !data.error && (
            <CheckCircle className="h-3.5 w-3.5 text-[#4a4a4a]" />
          )}
          {data.error && <AlertCircle className="h-3.5 w-3.5 text-[#ff4444]" />}
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3 bg-[#1a1a1a]">
        <div className="text-xs text-[#999999] mb-2 line-clamp-2">
          {definition.description}
        </div>

        {data.error && (
          <div className="mt-2 text-xs bg-[#2a1a1a] text-[#ff6666] p-2 rounded border border-[#3a2a2a]">
            {data.error}
          </div>
        )}

        {data.output && !data.error && (
          <div className="mt-2 text-xs text-[#999999]">
            ✓ Success
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#2a2a2a] !border-2 !border-[#4a4a4a] hover:!bg-[#4a4a4a]"
      />
    </div>
  );
}

export default memo(CustomNode);

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
        return "bg-[#f0f2f5] border-[#d1d7db]";
      case "ai":
        return "bg-[#f0f2f5] border-[#d1d7db]";
      case "action":
        return "bg-[#f0f2f5] border-[#d1d7db]";
      case "logic":
        return "bg-[#f0f2f5] border-[#d1d7db]";
      default:
        return "bg-[#f0f2f5] border-[#d1d7db]";
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg border transition-all shadow-sm
        ${selected ? "border-[#128c7e] ring-1 ring-[#128c7e] shadow-md" : "border-[#d1d7db]"}
        ${data.isExecuting ? "border-[#25d366]" : ""}
        ${data.error ? "border-[#ea0038]" : ""}
        min-w-[220px] max-w-[280px] overflow-hidden
      `}
    >
      {/* Input Handle */}
      {showInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-white !border-2 !border-[#b1b3b5] hover:!border-[#128c7e]"
        />
      )}

      {/* Node Header */}
      <div className={`${getCategoryColor()} px-3 py-2.5 border-b border-[#d1d7db] flex items-center gap-2.5`}>
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#128c7e]" />
        </div>
        <span className="font-semibold text-[#1c1e21] text-sm flex-1 truncate">
          {definition.label}
        </span>

        <div className="flex-shrink-0">
          {data.isExecuting && (
            <Loader2 className="h-3.5 w-3.5 text-[#128c7e] animate-spin" />
          )}
          {data.output && !data.isExecuting && !data.error && (
            <CheckCircle className="h-3.5 w-3.5 text-[#25d366]" />
          )}
          {data.error && <AlertCircle className="h-3.5 w-3.5 text-[#ea0038]" />}
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3 bg-white">
        <div className="text-xs text-[#65676b] mb-2 line-clamp-2">
          {definition.description}
        </div>

        {data.error && (
          <div className="mt-2 text-xs bg-[#fff1f0] text-[#ea0038] p-2 rounded border border-[#ffccc7]">
            {data.error}
          </div>
        )}

        {data.output && !data.error && (
          <div className="mt-2 text-xs text-[#25d366] font-medium">
            ✓ Success
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#b1b3b5] hover:!border-[#128c7e]"
      />
    </div>
  );
}

export default memo(CustomNode);

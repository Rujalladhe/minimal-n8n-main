"use client";

import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "@/lib/store";
import { nodeDefinitions } from "@/lib/node-definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

export default function NodeConfigPanel({
  nodeId,
  onClose,
}: NodeConfigPanelProps) {
  const { nodes, updateNode } = useWorkflowStore();
  const node = nodes.find((n) => n.id === nodeId);

  const [config, setConfig] = useState<Record<string, any>>(
    node?.data.config || {}
  );

  useEffect(() => {
    if (node?.data.config) {
      setConfig(node.data.config);
    }
  }, [node]);

  if (!node) return null;

  const definition = nodeDefinitions[node.data.type];
  if (!definition) return null;

  const handleSave = () => {
    updateNode(nodeId, { config });
    onClose();
  };

  const handleChange = (name: string, value: any) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-[#0a0a0a] border-l border-[#1a1a1a] z-50 overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#e5e5e5]">
            Configure Node
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            {definition.label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#666666] hover:text-[#e5e5e5] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {definition.configFields.map((field) => (
          <div key={field.name}>
            <Label className="text-[#999999] text-sm">
              {field.label}
              {field.required && <span className="text-[#ff4444] ml-1">*</span>}
            </Label>

            {field.type === "text" && (
              <Input
                type="text"
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] placeholder:text-[#666666] focus:border-[#4a4a4a]"
              />
            )}

            {field.type === "number" && (
              <Input
                type="number"
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] placeholder:text-[#666666] focus:border-[#4a4a4a]"
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] placeholder:text-[#666666] focus:border-[#4a4a4a] font-mono text-sm"
                rows={6}
              />
            )}

            {field.type === "select" && (
              <Select
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-[#e5e5e5] focus:border-[#4a4a4a]"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-[#1a1a1a] flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e5e5e5] px-4 py-2 rounded text-sm font-medium border border-[#3a3a3a] transition-colors"
          >
            Save Configuration
          </button>
          <button
            onClick={onClose}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#999999] px-4 py-2 rounded text-sm border border-[#2a2a2a] transition-colors"
          >
            Cancel
          </button>
        </div>

        {node.data.output && (
          <div className="mt-6 p-4 bg-[#1a1a1a] rounded border border-[#2a2a2a]">
            <h4 className="text-xs font-semibold text-[#999999] mb-2 uppercase tracking-wider">
              Last Output
            </h4>
            <pre className="text-xs text-[#666666] overflow-x-auto font-mono">
              {JSON.stringify(node.data.output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

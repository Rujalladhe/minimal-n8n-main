"use client";

import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "@/lib/store";
import { nodeDefinitions } from "@/lib/node-definitions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { X, Send, Trash2, MessageSquare, ExternalLink } from "lucide-react";

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

// ─── KPI DASHBOARD RENDERING ─────────────────────────────────────────
function KpiDashboardView({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="mt-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-[#1a1a1a] rounded-lg animate-pulse" />
        ))}
        <p className="text-xs text-[#666] text-center mt-4">
          Execute the workflow to see dashboard data
        </p>
      </div>
    );
  }

  const score = data.score ?? 0;
  const tier = data.tier || "UNKNOWN";
  const tierColors: Record<string, string> = {
    HOT: "#ef4444",
    WARM: "#f59e0b",
    COLD: "#3b82f6",
    UNKNOWN: "#6b7280",
  };
  const tierColor = tierColors[tier] || "#6b7280";

  // Score gauge SVG
  const gaugeRadius = 54;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeFill = (score / 100) * gaugeCircumference * 0.75; // 270° arc

  function formatValue(val: any, prefix = "", suffix = ""): string {
    if (val === null || val === undefined) return "—";
    if (typeof val === "number") {
      if (Math.abs(val) >= 1_000_000_000) return `${prefix}${(val / 1e9).toFixed(1)}B${suffix}`;
      if (Math.abs(val) >= 1_000_000) return `${prefix}${(val / 1e6).toFixed(1)}M${suffix}`;
      if (Math.abs(val) >= 1_000) return `${prefix}${(val / 1e3).toFixed(1)}K${suffix}`;
      return `${prefix}${val}${suffix}`;
    }
    return `${prefix}${val}${suffix}`;
  }

  function formatPercent(val: any): string {
    if (val === null || val === undefined) return "—";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return "—";
    const pct = num > 1 ? num : num * 100;
    const arrow = pct >= 0 ? "↑" : "↓";
    return `${arrow} ${Math.abs(pct).toFixed(1)}%`;
  }

  const kpis = data.kpis || {};

  return (
    <div className="mt-6 space-y-5">
      {/* Score Gauge + Tier Badge */}
      <div className="flex items-center justify-center gap-6 p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
        <div className="relative">
          <svg width="128" height="128" viewBox="0 0 128 128">
            {/* Background arc */}
            <circle
              cx="64" cy="64" r={gaugeRadius}
              fill="none" stroke="#2a2a2a" strokeWidth="10"
              strokeDasharray={`${gaugeCircumference * 0.75} ${gaugeCircumference * 0.25}`}
              strokeLinecap="round"
              transform="rotate(135 64 64)"
            />
            {/* Score arc */}
            <circle
              cx="64" cy="64" r={gaugeRadius}
              fill="none" stroke={tierColor} strokeWidth="10"
              strokeDasharray={`${gaugeFill} ${gaugeCircumference - gaugeFill}`}
              strokeLinecap="round"
              transform="rotate(135 64 64)"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text x="64" y="58" textAnchor="middle" fill="#e5e5e5" fontSize="28" fontWeight="bold">
              {score}
            </text>
            <text x="64" y="76" textAnchor="middle" fill="#999" fontSize="11">
              / 100
            </text>
          </svg>
        </div>
        <div className="text-center">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: tierColor }}
          >
            {tier === "HOT" ? "🔥 " : tier === "WARM" ? "🟡 " : tier === "COLD" ? "🔵 " : ""}{tier}
          </span>
          {data.confidence !== null && data.confidence !== undefined && (
            <p className="text-xs text-[#666] mt-2">
              AI Confidence: {(data.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </div>

      {/* AI Verdict */}
      {data.reasoning && (
        <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">AI Verdict</h4>
          <p className="text-sm text-[#ccc] leading-relaxed">{data.reasoning}</p>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Revenue", value: formatValue(kpis.revenue, "$") },
          { label: "Revenue Growth", value: formatPercent(kpis.revenueGrowth) },
          { label: "Employees", value: formatValue(kpis.employeeCount) },
          { label: "Total Funding", value: formatValue(kpis.totalFunding, "$") },
          { label: "Last Funding", value: kpis.lastFundingDate || "—" },
          { label: "Stage", value: kpis.lastFundingStage || "—" },
          { label: "Web Traffic/mo", value: formatValue(kpis.webTraffic) },
          { label: "Traffic Growth", value: formatPercent(kpis.trafficGrowth) },
        ].map((kpi, i) => (
          <div key={i} className="p-2.5 bg-[#111] rounded-lg border border-[#1a1a1a]">
            <p className="text-[10px] text-[#666] uppercase tracking-wider">{kpi.label}</p>
            <p className="text-sm font-semibold text-[#e5e5e5] mt-0.5">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Green Flags */}
      {data.greenFlags?.length > 0 && (
        <div className="p-3 bg-[#0a1a0a] rounded-lg border border-[#1a2a1a]">
          <h4 className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider mb-2">✓ Green Flags</h4>
          <ul className="space-y-1">
            {data.greenFlags.map((f: string, i: number) => (
              <li key={i} className="text-xs text-[#86efac]">✓ {f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {data.redFlags?.length > 0 && (
        <div className="p-3 bg-[#1a0a0a] rounded-lg border border-[#2a1a1a]">
          <h4 className="text-xs font-semibold text-[#f87171] uppercase tracking-wider mb-2">✗ Red Flags</h4>
          <ul className="space-y-1">
            {data.redFlags.map((f: string, i: number) => (
              <li key={i} className="text-xs text-[#fca5a5]">✗ {f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Signals */}
      {data.signals?.length > 0 && (
        <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">Scoring Signals</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.signals.map((s: string, i: number) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-[#2a2a2a] text-[#ccc] rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {data.recommendedAction && (
        <div className="p-3 rounded-lg border" style={{ borderColor: tierColor + "40", backgroundColor: tierColor + "08" }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: tierColor }}>
            Recommended Action
          </h4>
          <p className="text-sm text-[#e5e5e5] font-medium">{data.recommendedAction}</p>
        </div>
      )}

      {/* Best Angle + Deal Size */}
      {data.bestAngle && (
        <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-1">Best Outreach Angle</h4>
          <p className="text-sm text-[#ccc]">{data.bestAngle}</p>
        </div>
      )}

      {data.estimatedDealSize && (
        <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-1">Estimated Deal Size</h4>
          <p className="text-sm text-[#e5e5e5] font-semibold">{data.estimatedDealSize}</p>
        </div>
      )}
    </div>
  );
}

// ─── CHATBOT CONTEXT VIEW ────────────────────────────────────────────
function ChatbotContextView({
  nodeId,
  output,
  config,
}: {
  nodeId: string;
  output: any;
  config: Record<string, any>;
}) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If there's a company context from upstream, show it
  const hasCompanyContext = output?.hasCompanyContext || config?.companyContext;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "aiChatbot",
          config: {
            ...config,
            userMessage: userMsg,
            systemPrompt: config.systemPrompt || "You are a helpful assistant.",
          },
          input: output || {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response || "No response" }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get response" }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Network failure" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {hasCompanyContext && (
        <div className="p-2 bg-[#0a1a0a] rounded-lg border border-[#1a2a1a] text-center">
          <p className="text-xs text-[#4ade80]">
            ✓ Company context loaded — ask about this lead
          </p>
        </div>
      )}

      {/* Chat messages */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 p-3 bg-[#111] rounded-lg border border-[#1a1a1a]">
        {messages.length === 0 ? (
          <p className="text-xs text-[#666] text-center py-4">
            {hasCompanyContext
              ? "Ask about this company — revenue, funding, scoring, outreach strategy…"
              : "Start a conversation…"
            }
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-xs ${
                  msg.role === "user"
                    ? "bg-[#2a2a4a] text-[#c5c5ff]"
                    : "bg-[#1a1a1a] text-[#ccc] border border-[#2a2a2a]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg text-xs bg-[#1a1a1a] text-[#666] border border-[#2a2a2a]">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] placeholder:text-[#666] focus:border-[#4a4a4a] outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e5e5e5] rounded-lg border border-[#3a3a3a] disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Clear button */}
      {messages.length > 0 && (
        <button
          onClick={() => setMessages([])}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-[#666] hover:text-[#999] py-1.5 transition-colors"
        >
          <Trash2 className="h-3 w-3" /> Clear conversation
        </button>
      )}
    </div>
  );
}

// ─── MAIN CONFIG PANEL ───────────────────────────────────────────────
export default function NodeConfigPanel({
  nodeId,
  onClose,
}: NodeConfigPanelProps) {
  const { nodes, updateNode, currentWorkflowId } = useWorkflowStore();
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

  const isKpiDashboard = node.data.type === "kpiDashboard";
  const isChatbot = node.data.type === "aiChatbot";

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

        {/* KPI Dashboard Detail View */}
        {isKpiDashboard && (
          <div className="pt-4 border-t border-[#1a1a1a]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5">
                <span>📊</span> Lead Intelligence Output
              </h4>
              <a
                href={`/dashboard/${currentWorkflowId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-teal-400 hover:text-teal-300 transition-colors bg-[#0a2e2a] px-2 py-1 rounded border border-teal-900/50"
              >
                <ExternalLink className="w-3 h-3" />
                Full Dashboard
              </a>
            </div>
            <KpiDashboardView data={node.data.output} />
          </div>
        )}

        {/* Chatbot Context View */}
        {isChatbot && (
          <div className="pt-4 border-t border-[#1a1a1a]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" /> Interactive Chat
              </h4>
              <a
                href={`/chat/${currentWorkflowId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-blue-400 hover:text-blue-300 transition-colors bg-[#0a192e] px-2 py-1 rounded border border-blue-900/50"
              >
                <ExternalLink className="w-3 h-3" />
                Full Chat UI
              </a>
            </div>
            <ChatbotContextView
              nodeId={nodeId}
              output={node.data.output}
              config={config}
            />
          </div>
        )}

        {/* Last Output (for non-dashboard nodes) */}
        {node.data.output && !isKpiDashboard && (
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

"use client";

import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "@/lib/store";
import { nodeDefinitions } from "@/lib/node-definitions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { X, Send, Trash2, MessageSquare, ExternalLink, Eye, Copy, Check, Users, Clock, MousePointerClick } from "lucide-react";

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
          <div key={i} className="h-16 bg-[#f0f2f5] rounded-lg animate-pulse" />
        ))}
        <p className="text-xs text-[#65676b] text-center mt-4">
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
    COLD: "#128c7e",
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
      <div className="flex items-center justify-center gap-6 p-4 bg-white rounded-xl border border-[#d1d7db] shadow-sm">
        <div className="relative">
          <svg width="128" height="128" viewBox="0 0 128 128">
            {/* Background arc */}
            <circle
              cx="64" cy="64" r={gaugeRadius}
              fill="none" stroke="#f0f2f5" strokeWidth="10"
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
            <text x="64" y="58" textAnchor="middle" fill="#1c1e21" fontSize="28" fontWeight="bold">
              {score}
            </text>
            <text x="64" y="76" textAnchor="middle" fill="#65676b" fontSize="11">
              / 100
            </text>
          </svg>
        </div>
        <div className="text-center">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: tierColor }}
          >
            {tier === "HOT" ? "🔥 " : tier === "WARM" ? "🟡 " : tier === "COLD" ? "🔵 " : ""}{tier}
          </span>
          {data.confidence !== null && data.confidence !== undefined && (
            <p className="text-xs text-[#65676b] mt-2 font-medium">
              AI Confidence: {(data.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </div>

      {/* AI Verdict */}
      {data.reasoning && (
        <div className="p-3 bg-[#f0f2f5] rounded-lg border border-[#d1d7db]">
          <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider mb-2">AI Verdict</h4>
          <p className="text-sm text-[#1c1e21] leading-relaxed">{data.reasoning}</p>
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
          <div key={i} className="p-2.5 bg-white rounded-lg border border-[#d1d7db] shadow-sm">
            <p className="text-[10px] text-[#65676b] uppercase tracking-wider font-bold">{kpi.label}</p>
            <p className="text-sm font-bold text-[#1c1e21] mt-0.5">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Green Flags */}
      {data.greenFlags?.length > 0 && (
        <div className="p-3 bg-[#e7fce3] rounded-lg border border-[#25d366]/20 shadow-sm">
          <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider mb-2">✓ Green Flags</h4>
          <ul className="space-y-1">
            {data.greenFlags.map((f: string, i: number) => (
              <li key={i} className="text-xs text-[#1c1e21]">✓ {f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {data.redFlags?.length > 0 && (
        <div className="p-3 bg-[#fff1f0] rounded-lg border border-[#ea0038]/20 shadow-sm">
          <h4 className="text-xs font-bold text-[#ea0038] uppercase tracking-wider mb-2">✗ Red Flags</h4>
          <ul className="space-y-1">
            {data.redFlags.map((f: string, i: number) => (
              <li key={i} className="text-xs text-[#1c1e21]">✗ {f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Action */}
      {data.recommendedAction && (
        <div className="p-3 rounded-lg border shadow-sm" style={{ borderColor: tierColor + "40", backgroundColor: tierColor + "08" }}>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: tierColor }}>
            Recommended Action
          </h4>
          <p className="text-sm text-[#1c1e21] font-bold">{data.recommendedAction}</p>
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
        <div className="p-2 bg-[#e7fce3] rounded-lg border border-[#25d366]/20 text-center shadow-sm">
          <p className="text-xs text-[#128c7e] font-bold">
            ✓ Company context loaded — ask about this lead
          </p>
        </div>
      )}

      {/* Chat messages */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 p-3 bg-[#f0f2f5] rounded-lg border border-[#d1d7db] shadow-inner">
        {messages.length === 0 ? (
          <p className="text-xs text-[#65676b] text-center py-4 font-medium">
            {hasCompanyContext
              ? "Ask about this company — revenue, funding, scoring, outreach strategy…"
              : "Start a conversation…"
            }
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#128c7e] text-white rounded-tr-none"
                    : "bg-white text-[#1c1e21] border border-[#d1d7db] rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-2xl text-xs bg-white text-[#65676b] border border-[#d1d7db] rounded-tl-none shadow-sm">
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
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-sm bg-white border border-[#d1d7db] rounded-full text-[#1c1e21] placeholder:text-[#65676b] focus:border-[#128c7e] outline-none shadow-sm transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 bg-[#128c7e] hover:bg-[#075e54] text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-all shadow-md active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── WEBSITE TRACKER VIEW ────────────────────────────────────────────
function WebsiteTrackerView({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);

  const copyEmbed = () => {
    if (data?.embedCode) {
      navigator.clipboard.writeText(data.embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) {
    return (
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#f0f2f5] rounded-lg animate-pulse" />
        ))}
        <p className="text-xs text-[#65676b] text-center mt-4">
          Execute the workflow to generate tracking code
        </p>
      </div>
    );
  }

  const analytics = data.analytics || {};

  return (
    <div className="mt-6 space-y-4">
      {/* Embed Code */}
      <div className="p-3 bg-[#f0f2f5] rounded-lg border border-[#d1d7db]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider">Embed Code</h4>
          <button
            onClick={copyEmbed}
            className="flex items-center gap-1 text-[10px] font-bold text-[#128c7e] hover:bg-white px-2 py-1 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="text-[10px] text-[#1c1e21] font-mono bg-white p-2 rounded border border-[#d1d7db]/50 overflow-x-auto whitespace-pre-wrap break-all">
          {data.embedCode}
        </pre>
        <p className="text-[10px] text-[#65676b] mt-2">
          Add this script tag to your website&apos;s {'<head>'} or before {'</body>'}
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 bg-white rounded-lg border border-[#d1d7db] shadow-sm text-center">
          <Users className="w-4 h-4 text-[#128c7e] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1c1e21]">{analytics.totalVisitors || 0}</p>
          <p className="text-[9px] text-[#65676b] uppercase tracking-wider font-bold">Visitors</p>
        </div>
        <div className="p-2.5 bg-white rounded-lg border border-[#d1d7db] shadow-sm text-center">
          <Clock className="w-4 h-4 text-[#f59e0b] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1c1e21]">{analytics.avgTimeSeconds || 0}s</p>
          <p className="text-[9px] text-[#65676b] uppercase tracking-wider font-bold">Avg Time</p>
        </div>
        <div className="p-2.5 bg-white rounded-lg border border-[#d1d7db] shadow-sm text-center">
          <MousePointerClick className="w-4 h-4 text-[#ef4444] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1c1e21]">{analytics.avgClicks || 0}</p>
          <p className="text-[9px] text-[#65676b] uppercase tracking-wider font-bold">Avg Clicks</p>
        </div>
      </div>

      {/* Score Distribution */}
      {analytics.scoreDistribution && (
        <div className="p-3 bg-white rounded-lg border border-[#d1d7db] shadow-sm">
          <h4 className="text-[10px] text-[#65676b] uppercase tracking-wider font-bold mb-2">Lead Score Distribution</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#f0f2f5] rounded-full h-3 overflow-hidden flex">
              {analytics.scoreDistribution.hot > 0 && (
                <div
                  className="bg-[#ef4444] h-full transition-all"
                  style={{ width: `${(analytics.scoreDistribution.hot / (analytics.totalVisitors || 1)) * 100}%` }}
                />
              )}
              {analytics.scoreDistribution.warm > 0 && (
                <div
                  className="bg-[#f59e0b] h-full transition-all"
                  style={{ width: `${(analytics.scoreDistribution.warm / (analytics.totalVisitors || 1)) * 100}%` }}
                />
              )}
              {analytics.scoreDistribution.cold > 0 && (
                <div
                  className="bg-[#3b82f6] h-full transition-all"
                  style={{ width: `${(analytics.scoreDistribution.cold / (analytics.totalVisitors || 1)) * 100}%` }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-[10px]">
            <span className="text-[#ef4444] font-bold">🔥 {analytics.scoreDistribution.hot || 0} Hot</span>
            <span className="text-[#f59e0b] font-bold">🟡 {analytics.scoreDistribution.warm || 0} Warm</span>
            <span className="text-[#3b82f6] font-bold">🔵 {analytics.scoreDistribution.cold || 0} Cold</span>
          </div>
        </div>
      )}

      {/* Tracking Status */}
      <div className="p-3 bg-[#e7fce3] rounded-lg border border-[#25d366]/20">
        <h4 className="text-xs font-bold text-[#128c7e] mb-2">✓ Tracking Active</h4>
        <div className="flex flex-wrap gap-2">
          {data.trackingEnabled?.clicks && (
            <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-[#25d366]/30 text-[#075e54] font-medium">Clicks</span>
          )}
          {data.trackingEnabled?.scroll && (
            <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-[#25d366]/30 text-[#075e54] font-medium">Scroll</span>
          )}
          {data.trackingEnabled?.time && (
            <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-[#25d366]/30 text-[#075e54] font-medium">Time</span>
          )}
        </div>
      </div>
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
  const isWebsiteTracker = node.data.type === "websiteTracker";

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white border-l border-[#d1d7db] z-50 overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="sticky top-0 bg-white border-b border-[#d1d7db] p-4 flex items-center justify-between z-10">
        <div>
          <h3 className="text-lg font-bold text-[#128c7e]">
            Configure Node
          </h3>
          <p className="text-xs text-[#65676b] font-medium">
            {definition.label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#65676b] hover:text-[#1c1e21] transition-colors p-1.5 hover:bg-[#f0f2f5] rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {definition.configFields.map((field) => (
          <div key={field.name}>
            <Label className="text-[#1c1e21] font-bold text-xs uppercase tracking-wider">
              {field.label}
              {field.required && <span className="text-[#ea0038] ml-1">*</span>}
            </Label>

            {field.type === "text" && (
              <Input
                type="text"
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-2 bg-[#f0f2f5] border-[#d1d7db] text-[#1c1e21] placeholder:text-[#65676b] focus:border-[#128c7e] rounded-lg shadow-sm"
              />
            )}

            {field.type === "number" && (
              <Input
                type="number"
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-2 bg-[#f0f2f5] border-[#d1d7db] text-[#1c1e21] placeholder:text-[#65676b] focus:border-[#128c7e] rounded-lg shadow-sm"
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-2 bg-[#f0f2f5] border-[#d1d7db] text-[#1c1e21] placeholder:text-[#65676b] focus:border-[#128c7e] font-mono text-sm rounded-lg shadow-sm"
                rows={6}
              />
            )}

            {field.type === "select" && (
              <Select
                value={config[field.name] || field.defaultValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="mt-2 bg-[#f0f2f5] border-[#d1d7db] text-[#1c1e21] focus:border-[#128c7e] rounded-lg shadow-sm"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white">
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
        ))}

        <div className="pt-6 border-t border-[#d1d7db] flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#128c7e] hover:bg-[#075e54] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
          >
            Save Configuration
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-[#f0f2f5] text-[#65676b] rounded-xl text-sm font-bold border border-[#d1d7db] transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>

        {/* KPI Dashboard Detail View */}
        {isKpiDashboard && (
          <div className="pt-6 border-t border-[#d1d7db]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider flex items-center gap-2">
                <span>📊</span> Lead Intelligence
              </h4>
              <a
                href={`/dashboard/${currentWorkflowId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#128c7e] hover:bg-[#e7fce3] transition-colors bg-white px-2.5 py-1.5 rounded-lg border border-[#25d366]/30 shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Open Dashboard
              </a>
            </div>
            <KpiDashboardView data={node.data.output} />
          </div>
        )}

        {/* Chatbot Context View */}
        {isChatbot && (
          <div className="pt-6 border-t border-[#d1d7db]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Interactive Chat
              </h4>
              <a
                href={`/chat/${currentWorkflowId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#128c7e] hover:bg-[#e7fce3] transition-colors bg-white px-2.5 py-1.5 rounded-lg border border-[#25d366]/30 shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Open Chat
              </a>
            </div>
            <ChatbotContextView
              nodeId={nodeId}
              output={node.data.output}
              config={config}
            />
          </div>
        )}

        {/* Website Tracker View */}
        {isWebsiteTracker && (
          <div className="pt-6 border-t border-[#d1d7db]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#128c7e] uppercase tracking-wider flex items-center gap-2">
                <Eye className="h-3.5 w-3.5" /> Visitor Tracking
              </h4>
              {(() => {
                const targetSiteId = node.data.output?.siteId || (config.websiteUrl ? config.websiteUrl.replace(/https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 40) : "");
                return targetSiteId ? (
                  <a
                    href={`/analytics/${targetSiteId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#128c7e] hover:bg-[#e7fce3] transition-colors bg-white px-2.5 py-1.5 rounded-lg border border-[#25d366]/30 shadow-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Dashboard
                  </a>
                ) : null;
              })()}
            </div>
            <WebsiteTrackerView data={node.data.output} />
          </div>
        )}

        {/* Last Output */}
        {node.data.output && !isKpiDashboard && !isWebsiteTracker && (
          <div className="mt-8 p-4 bg-[#f0f2f5] rounded-xl border border-[#d1d7db] shadow-inner">
            <h4 className="text-xs font-bold text-[#65676b] mb-3 uppercase tracking-wider">
              Last Output
            </h4>
            <pre className="text-[10px] text-[#1c1e21] overflow-x-auto font-mono bg-white/50 p-2 rounded border border-[#d1d7db]/50">
              {JSON.stringify(node.data.output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

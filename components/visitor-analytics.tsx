"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Users,
  Clock,
  MousePointerClick,
  Eye,
  Activity,
  Globe,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Scroll,
  Bell,
  UserCheck,
} from "lucide-react";

interface VisitorRow {
  visitorId: string;
  name?: string;
  email?: string;
  score: number;
  scoreBreakdown?: {
    time: number;
    clicks: number;
    scroll: number;
    pages: number;
    loyalty: number;
  };
  totalTimeSeconds: number;
  maxScrollDepth: number;
  clickCount: number;
  pages: string[];
  pagesVisited: number;
  startedAt: string;
  lastActiveAt: string;
  userAgent: string;
  referrer: string;
  isActive: boolean;
}

interface AnalyticsData {
  siteId: string;
  totalVisitors: number;
  activeVisitors: number;
  avgTimeSeconds: number;
  avgScrollDepth: number;
  avgClicks: number;
  topPages: { page: string; views: number }[];
  topClickedElements: { element: string; clicks: number }[];
  visitors: VisitorRow[];
  scoreDistribution: { hot: number; warm: number; cold: number };
  timeline: { time: string; events: number; visitors: number }[];
  scrollDistribution: { range: string; count: number }[];
}

// ─── SCORE GAUGE ─────────────────────────────────────────────────────
function ScoreGauge({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const fill = (score / 100) * circumference * 0.75;

  const getColor = (s: number) => {
    if (s >= 70) return "#ef4444";
    if (s >= 40) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="4"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeLinecap="round"
        transform={`rotate(135 ${size / 2} ${size / 2})`}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getColor(score)}
        strokeWidth="4"
        strokeDasharray={`${fill} ${circumference - fill}`}
        strokeLinecap="round"
        transform={`rotate(135 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0f172a"
        fontSize={size * 0.28}
        fontWeight="bold"
      >
        {score}
      </text>
    </svg>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-lg group hover:border-slate-200 transition-all duration-300">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
        style={{ background: gradient }}
      />
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {title}
        </h4>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      {subtitle && (
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}

// ─── TIER BADGE ──────────────────────────────────────────────────────
function TierBadge({ score }: { score: number }) {
  if (score >= 70)
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-600 border border-red-500/30">
        🔥 HOT
      </span>
    );
  if (score >= 40)
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30">
        🟡 WARM
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-600 border border-blue-500/30">
      🔵 COLD
    </span>
  );
}

// ─── FORMAT HELPERS ──────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function parseUA(ua: string): string {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Unknown";
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
export default function VisitorAnalyticsDashboard({
  siteId,
}: {
  siteId: string;
}) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null);
  const [visitorEvents, setVisitorEvents] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: string }[]>([]);
  const knownVisitors = React.useRef<Set<string>>(new Set());
  const knownIdentified = React.useRef<Set<string>>(new Set());

  const addToast = useCallback((message: string, type: string = 'new') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/tracking/analytics?siteId=${encodeURIComponent(siteId)}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();

      // Detect new visitors & newly identified users → show toasts
      if (json.visitors) {
        json.visitors.forEach((v: VisitorRow) => {
          const isNew = !knownVisitors.current.has(v.visitorId);
          const justIdentified = (v.name || v.email) && !knownIdentified.current.has(v.visitorId);

          if (isNew) {
            knownVisitors.current.add(v.visitorId);
            if (knownVisitors.current.size > 1) { // don't toast on first load
              const label = v.name || v.email || `Anonymous visitor`;
              addToast(`🆕 New visitor: ${label} (score ${v.score})`, 'new');
            }
          } else if (justIdentified) {
            const label = v.name ? v.name : v.email!;
            addToast(`✅ ${label} just submitted the form! Score: ${v.score}/100`, 'identified');
          }

          if (v.name || v.email) knownIdentified.current.add(v.visitorId);
        });
      }

      setData(json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [siteId, addToast]);

  // Fetch visitor detail when expanded
  const fetchVisitorDetail = useCallback(
    async (visitorId: string) => {
      try {
        const res = await fetch(
          `/api/tracking/analytics?siteId=${encodeURIComponent(siteId)}&visitorId=${encodeURIComponent(visitorId)}`
        );
        if (res.ok) {
          const json = await res.json();
          setVisitorEvents(json.events || []);
        }
      } catch {
        setVisitorEvents([]);
      }
    },
    [siteId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 2 seconds for near real-time
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const toggleVisitor = (visitorId: string) => {
    if (expandedVisitor === visitorId) {
      setExpandedVisitor(null);
      setVisitorEvents([]);
    } else {
      setExpandedVisitor(visitorId);
      fetchVisitorDetail(visitorId);
    }
  };

  const COLORS = [
    "#0ea5e9",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f97316",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium tracking-wider uppercase">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            {error || "No data available"}
          </h1>
          <p className="text-slate-500 mb-6">
            Make sure the tracking script is installed on your website and
            visitors have started browsing.
          </p>
          <button
            onClick={fetchData}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-slate-900 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Hot", value: data.scoreDistribution.hot, color: "#ef4444" },
    { name: "Warm", value: data.scoreDistribution.warm, color: "#f59e0b" },
    { name: "Cold", value: data.scoreDistribution.cold, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      {/* ─── TOASTS ─── */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl ${
              toast.type === "identified"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}
          >
            {toast.type === "identified" ? (
              <UserCheck className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Bell className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </div>
        ))}
      </div>
      {/* ─── HEADER ─── */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Eye className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
                  Visitor Analytics
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                <Globe className="w-3 h-3" /> {siteId}
                {data.activeVisitors > 0 && (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {data.activeVisitors} live
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                autoRefresh
                  ? "border-teal-500/50 text-teal-600 bg-teal-500/10"
                  : "border-slate-200 text-slate-500 bg-transparent"
              }`}
            >
              <RefreshCw
                className={`w-3 h-3 inline mr-1 ${autoRefresh ? "animate-spin" : ""}`}
                style={{ animationDuration: "3s" }}
              />
              {autoRefresh ? "Live" : "Paused"}
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* ─── STAT CARDS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Visitors"
            value={data.totalVisitors}
            subtitle={`${data.activeVisitors} currently active`}
            icon={<Users className="w-4 h-4 text-white" />}
            gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
          />
          <StatCard
            title="Avg Time on Site"
            value={formatTime(data.avgTimeSeconds)}
            subtitle="Per session"
            icon={<Clock className="w-4 h-4 text-white" />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
          <StatCard
            title="Avg Clicks"
            value={data.avgClicks}
            subtitle="Per visitor"
            icon={<MousePointerClick className="w-4 h-4 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
          <StatCard
            title="Avg Scroll Depth"
            value={`${data.avgScrollDepth}%`}
            subtitle="Of page content"
            icon={<Scroll className="w-4 h-4 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
        </div>

        {/* ─── CHARTS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Timeline */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" /> Engagement
              Timeline (Last Hour)
            </h3>
            <div className="w-full h-[250px]">
              {data.timeline && data.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.timeline}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorEvents"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2dd4bf"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2dd4bf"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#cbd5e1"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      interval={9}
                    />
                    <YAxis
                      stroke="#cbd5e1"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#0d9488" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="events"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorEvents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No timeline data yet
                </div>
              )}
            </div>
          </div>

          {/* Score Distribution Pie */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              Lead Score Distribution
            </h3>
            <div className="flex-1 w-full min-h-[200px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No visitors yet
                </div>
              )}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECOND ROW: Clicks + Scroll + Pages ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Clicked Elements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-amber-600" /> Top
              Clicked Elements
            </h3>
            {data.topClickedElements.length > 0 ? (
              <div className="space-y-2">
                {data.topClickedElements.slice(0, 8).map((el, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-600 truncate max-w-[180px]">
                          {el.element}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {el.clicks}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(el.clicks / (data.topClickedElements[0]?.clicks || 1)) * 100}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-8">
                No click data yet
              </p>
            )}
          </div>

          {/* Scroll Depth Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Scroll className="w-4 h-4 text-emerald-600" /> Scroll Depth
            </h3>
            <div className="w-full h-[200px]">
              {data.scrollDistribution && data.scrollDistribution.some((d) => d.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.scrollDistribution}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="range"
                      stroke="#cbd5e1"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#cbd5e1"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {data.scrollDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${160 + index * 15}, 60%, ${45 - index * 5}%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No scroll data yet
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-600" /> Top Pages
            </h3>
            {data.topPages.length > 0 ? (
              <div className="space-y-3">
                {data.topPages.slice(0, 8).map((page, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <span className="text-xs text-slate-600 font-mono truncate max-w-[200px]">
                      {page.page}
                    </span>
                    <span className="text-xs text-teal-600 font-bold">
                      {page.views}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-8">
                No page data yet
              </p>
            )}
          </div>
        </div>

        {/* ─── VISITOR TABLE ─── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> All Visitors ({data.totalVisitors})
            </h3>
          </div>

          {data.visitors.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {/* Header */}
              <div className="grid grid-cols-8 gap-3 px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50">
                <div>Visitor</div>
                <div className="text-center">Score</div>
                <div className="text-center">Tier</div>
                <div className="text-center">Time</div>
                <div className="text-center">Clicks</div>
                <div className="text-center">Scroll</div>
                <div className="text-center">Pages</div>
                <div className="text-right">Last Active</div>
              </div>

              {/* Rows */}
              {data.visitors.map((visitor) => (
                <div key={visitor.visitorId}>
                  <div
                    className="grid grid-cols-8 gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors items-center"
                    onClick={() => toggleVisitor(visitor.visitorId)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {visitor.isActive && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                      )}
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {visitor.name || visitor.visitorId.substring(0, 12) + "…"}
                        </span>
                        {visitor.email && (
                          <span className="text-[10px] text-slate-500 truncate">
                            {visitor.email}
                          </span>
                        )}
                        {!visitor.name && !visitor.email && (
                          <span className="text-[10px] text-slate-400 italic">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ScoreGauge score={visitor.score} size={36} />
                    </div>
                    <div className="flex justify-center">
                      <TierBadge score={visitor.score} />
                    </div>
                    <div className="text-center text-xs text-slate-600">
                      {formatTime(visitor.totalTimeSeconds)}
                    </div>
                    <div className="text-center text-xs text-slate-600">
                      {visitor.clickCount}
                    </div>
                    <div className="text-center text-xs text-slate-600">
                      {visitor.maxScrollDepth}%
                    </div>
                    <div className="text-center text-xs text-slate-600">
                      {visitor.pagesVisited}
                    </div>
                    <div className="text-right flex items-center justify-end gap-2">
                      <span className="text-xs text-slate-500">
                        {formatTimeAgo(visitor.lastActiveAt)}
                      </span>
                      {expandedVisitor === visitor.visitorId ? (
                        <ChevronUp className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedVisitor === visitor.visitorId && (
                    <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                            Browser
                          </h5>
                          <p className="text-xs text-slate-600">
                            {parseUA(visitor.userAgent)}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                            Score Breakdown
                          </h5>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { label: 'Time', val: visitor.scoreBreakdown?.time || 0, max: 30, color: '#0ea5e9' },
                              { label: 'Clicks', val: visitor.scoreBreakdown?.clicks || 0, max: 25, color: '#f59e0b' },
                              { label: 'Scroll', val: visitor.scoreBreakdown?.scroll || 0, max: 20, color: '#10b981' },
                              { label: 'Pages', val: visitor.scoreBreakdown?.pages || 0, max: 15, color: '#8b5cf6' },
                              { label: 'Loyalty', val: visitor.scoreBreakdown?.loyalty || 0, max: 10, color: '#ec4899' },
                            ].map((s, i) => (
                              <div key={i} className="bg-slate-100/50 p-2 rounded border border-slate-300/50 text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-black mb-1">{s.label}</div>
                                <div className="text-sm font-bold" style={{ color: s.color }}>{s.val}</div>
                                <div className="text-[8px] text-slate-400">/{s.max}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                            First Seen
                          </h5>
                          <p className="text-xs text-slate-600">
                            {new Date(visitor.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                            Pages Visited
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {visitor.pages.map((p, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-teal-600 border border-teal-500/20"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                            Technology
                          </h5>
                          <p className="text-[10px] text-slate-500 font-mono bg-slate-100 p-2 rounded border border-slate-200">
                            {visitor.userAgent}
                          </p>
                        </div>
                      </div>

                      {/* Event Timeline */}
                      {visitorEvents.length > 0 && (
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">
                            Event Timeline (last 20)
                          </h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {visitorEvents.slice(-20).map((event: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 text-[11px] py-1 px-2 rounded hover:bg-white"
                              >
                                <span className="text-[10px] text-slate-500 font-mono w-16 flex-shrink-0">
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    event.type === "click"
                                      ? "bg-amber-500/20 text-amber-600"
                                      : event.type === "scroll"
                                        ? "bg-emerald-500/20 text-emerald-600"
                                        : event.type === "pageview"
                                          ? "bg-blue-500/20 text-blue-600"
                                          : event.type === "leave"
                                            ? "bg-red-500/20 text-red-600"
                                            : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {event.type}
                                </span>
                                <span className="text-slate-500 truncate">
                                  {event.type === "click"
                                    ? `${event.data?.tag || ""} "${(event.data?.text || "").substring(0, 40)}"`
                                    : event.type === "scroll"
                                      ? `${event.data?.depth || 0}% depth`
                                      : event.type === "pageview"
                                        ? event.data?.page || ""
                                        : event.type === "heartbeat"
                                          ? `${event.data?.timeOnPage || 0}s on page`
                                          : JSON.stringify(event.data || {}).substring(0, 60)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-[#1a1a2e] mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-400 mb-2">
                No visitors yet
              </h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Add the tracking script to your website and wait for visitors to
                browse. Data will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

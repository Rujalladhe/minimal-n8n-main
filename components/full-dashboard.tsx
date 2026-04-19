"use client";

import React from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Activity,
  ArrowUpRight 
} from "lucide-react";

export default function FullDashboard({ data }: { data: any }) {
  // Safe extraction of research data (which holds the arrays we generated)
  const research = data.research || {};
  const { 
    revenueHistory = [], 
    hiringTrend = [], 
    sentiment = { positive: 60, neutral: 30, negative: 10 }, 
    intentAnalysis = [], 
    competitorMarketShare = [] 
  } = research;

  // Format sentiment for PieChart
  const sentimentData = [
    { name: "Positive", value: Number(sentiment.positive) || 0, color: "#10b981" },
    { name: "Neutral", value: Number(sentiment.neutral) || 0, color: "#6b7280" },
    { name: "Negative", value: Number(sentiment.negative) || 0, color: "#ef4444" },
  ];

  const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6 mb-8 mt-4">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
            {data.companyName || "Unknown"} Intelligence
          </h1>
          <div className="flex items-center space-x-4 text-sm text-[#888]">
            {data.domain && (
              <span className="flex items-center"><Globe className="w-4 h-4 mr-1" /> {data.domain}</span>
            )}
            {research.hq && (
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {research.hq}</span>
            )}
            {data.industry && (
              <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {data.industry}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#666] tracking-widest uppercase mb-1">Lead Score</div>
          <div className={`text-5xl font-black ${
            data.tier === "HOT" ? "text-emerald-400" : data.tier === "WARM" ? "text-amber-400" : "text-blue-400"
          }`}>
            {data.score || "0"}
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Estimated Employees" value={research.employeeEstimate || "N/A"} icon={<Users className="w-4 h-4 text-blue-400" />} />
        <StatCard title="Total Funding" value={data.totalFunding || "N/A"} icon={<Building2 className="w-4 h-4 text-emerald-400" />} />
        <StatCard title="Est. Deal Size" value={data.estimatedDealSize || "TBD"} icon={<TrendingUp className="w-4 h-4 text-purple-400" />} />
        <StatCard title="Health Impression" value={research.healthImpression || "Stable"} isText />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* REVENUE HISTORY */}
        <div className="col-span-2 bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-teal-400" /> Revenue Trajectory ($M)
          </h3>
          <div className="w-full h-[300px]">
            {revenueHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#2dd4bf' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#444]">Not enough data</div>
            )}
          </div>
        </div>

        {/* SENTIMENT */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6 flex items-center">
            Brand Sentiment
          </h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            {sentimentData.map((s, i) => (
              <div key={i} className="flex items-center text-xs text-[#888]">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color }}></div>
                {s.name} ({s.value}%)
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HIRING TREND */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-2 text-purple-400" /> Hiring Momentum
          </h3>
          <div className="w-full h-[250px]">
            {hiringTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiringTrend} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#a78bfa' }}
                  />
                  <Line type="monotone" dataKey="headcount" stroke="#a78bfa" strokeWidth={3} dot={{ fill: '#a78bfa', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#444]">Not enough data</div>
            )}
          </div>
        </div>

        {/* INTENT ANALYSIS */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-6">
            Buyer Intent Signals
          </h3>
          <div className="w-full h-[250px]">
            {intentAnalysis.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentAnalysis} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" stroke="#666" domain={[0, 10]} />
                  <YAxis dataKey="topic" type="category" stroke="#888" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: '#222' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {intentAnalysis.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#444]">Not enough data</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, isText = false }: { title: string, value: string | number, icon?: React.ReactNode, isText?: boolean }) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider">{title}</h4>
        {icon}
      </div>
      <div className={`${isText ? 'text-sm text-[#ccc] font-medium leading-relaxed' : 'text-2xl font-bold text-white'}`}>
        {value}
      </div>
    </div>
  );
}

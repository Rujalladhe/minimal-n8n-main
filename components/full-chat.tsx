"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Trash2, ShieldCheck, Sparkles } from "lucide-react";

export default function FullChat({
  output,
  config,
  companyName
}: {
  output: any;
  config: Record<string, any>;
  companyName: string;
}) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasCompanyContext = output?.hasCompanyContext || config?.companyContext;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-screen bg-[#0a0a0a] font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 bg-[#141414] border-b border-[#2a2a2a] shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-500/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Lead Intelligence AI</h1>
            <p className="text-xs text-[#888]">
              Analyzing {companyName !== "Unknown" ? <span className="text-teal-400">{companyName}</span> : "pipeline data"}
            </p>
          </div>
        </div>
        {hasCompanyContext && (
          <div className="flex items-center space-x-2 bg-[#0a2e2a] border border-[#10b981]/30 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Context Synced</span>
          </div>
        )}
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center opacity-60">
              <Sparkles className="w-12 h-12 text-[#666] mb-4" />
              <h2 className="text-lg font-medium text-white mb-2">Welcome to AI Lead Intelligence</h2>
              <p className="text-sm text-[#888] max-w-sm">
                I have memorized all research, funding, and classification signals regarding this lead. 
                Ask me drafting strategies or to analyze the data.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex items-start max-w-[85%] md:max-w-[75%] space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  
                  {/* Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-teal-900 border border-teal-700 text-teal-400"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#e5e5e5] rounded-tl-sm shadow-sm"
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[75%] space-x-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-teal-900 border border-teal-700 text-teal-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] rounded-tl-sm flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA */}
      <footer className="p-4 bg-[#141414] border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto">
          {messages.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setMessages([])}
                className="flex items-center text-xs text-[#666] hover:text-[#f43f5e] transition-colors gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear History
              </button>
            </div>
          )}
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={hasCompanyContext ? `Ask about ${companyName !== "Unknown" ? companyName : "this lead"}...` : "Message the AI..."}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-inner"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg disabled:opacity-30 disabled:hover:bg-teal-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-[#555] mt-3">
            AI can make mistakes. Verify important information securely.
          </p>
        </div>
      </footer>
    </div>
  );
}

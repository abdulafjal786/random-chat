"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "@/components/MessageBubble";
import StatusBar from "@/components/StatusBar";
import AdPanel from "@/components/AdPanel";

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      router.push("/");
      return;
    }
    setUserId(id);
  }, [router]);

  const { messages, status, sendMessage, skip } = useChat(userId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || status !== "connected") return;
    sendMessage(input.trim());
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="border-b border-gray-800/60 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            💬
          </div>
          <span className="text-white font-bold text-sm tracking-tight">RandomChat</span>
        </Link>
        <span className="text-gray-600 text-xs font-mono">
          ID: {userId?.slice(0, 8)}…
        </span>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden gap-0 lg:gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {/* Chat column */}
        <section className="flex flex-col flex-1 min-w-0 gap-3">
          <StatusBar status={status} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-800/60 p-4 min-h-0"
            style={{ background: "#0f0f18" }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                {status === "searching" ? (
                  <>
                    <div className="w-12 h-12 border-2 border-violet-600/40 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Looking for someone to chat with…</p>
                  </>
                ) : status === "connected" ? (
                  <>
                    <span className="text-3xl">👋</span>
                    <p className="text-gray-400 text-sm">You&apos;re connected! Say hello.</p>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">💤</span>
                    <p className="text-gray-500 text-sm">
                      {status === "disconnected"
                        ? "Chat ended. Reconnecting soon…"
                        : "Click 'Start Chatting' to begin."}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status !== "connected"}
              placeholder={
                status === "connected"
                  ? "Type a message…"
                  : status === "searching"
                  ? "Waiting for a match…"
                  : "Not connected"
              }
              className="flex-1 px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={status !== "connected" || !input.trim()}
              className="px-5 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Send
            </button>
          </div>

          {/* Skip button */}
          <button
            onClick={skip}
            disabled={status === "idle"}
            className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium hover:border-violet-700/60 hover:text-violet-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ⏭ Skip / Find New Partner
          </button>
        </section>

        {/* Right panel */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col">
          <AdPanel />
        </aside>
      </div>
    </div>
  );
}

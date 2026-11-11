"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { registerUser } from "@/lib/api";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    setLoading(true);
    setError("");
    try {
      let userId = localStorage.getItem("user_id");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("user_id", userId);
      }
      await registerUser(userId);
      router.push("/chat");
    } catch {
      setError("Could not connect to server. Make sure the backend is running.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: "#0a0a0f" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
      </div>

      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3 z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
          💬
        </div>
        <span className="text-xs font-bold text-violet-400 uppercase tracking-[0.3em]">
          RandomChat
        </span>
      </div>

      {/* Hero */}
      <div className="text-center z-10 max-w-lg">
        <h1 className="text-5xl font-black text-white leading-none mb-4 tracking-tight">
          Talk to{" "}
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            strangers.
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          Anonymous real-time conversations with random people worldwide.
          No account. No history. Just talk.
        </p>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full max-w-xs py-4 px-8 rounded-2xl text-white font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl"
          style={{
            background: loading ? "#4c1d95" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            "Start Chatting →"
          )}
        </button>

        {error && (
          <p className="mt-4 text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <p className="mt-6 text-gray-600 text-xs">
          By continuing, you agree to be kind and respectful.
        </p>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg w-full z-10">
        {[
          { icon: "⚡", label: "Instant match" },
          { icon: "🔒", label: "Anonymous" },
          { icon: "🌍", label: "Worldwide" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
            <span className="text-2xl">{icon}</span>
            <span className="text-gray-400 text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

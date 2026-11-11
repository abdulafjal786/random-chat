import { ChatStatus } from "@/types";

const CONFIG: Record<
  ChatStatus,
  { label: string; color: string; dot: string }
> = {
  idle: {
    label: "Not connected",
    color: "bg-gray-900 text-gray-400 border-gray-700",
    dot: "bg-gray-500",
  },
  searching: {
    label: "Searching for a partner...",
    color: "bg-gray-900 text-amber-400 border-amber-800",
    dot: "bg-amber-400 animate-pulse",
  },
  connected: {
    label: "Connected with a stranger",
    color: "bg-gray-900 text-emerald-400 border-emerald-800",
    dot: "bg-emerald-400",
  },
  disconnected: {
    label: "Disconnected — reconnecting in 5s...",
    color: "bg-gray-900 text-red-400 border-red-800",
    dot: "bg-red-400",
  },
};

export default function StatusBar({ status }: { status: ChatStatus }) {
  const { label, color, dot } = CONFIG[status];
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${color}`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </div>
  );
}

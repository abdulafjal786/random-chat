import { ChatMessage } from "@/types";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
          message.isOwn
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-gray-800 text-gray-100 rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            message.isOwn ? "text-violet-300" : "text-gray-500"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

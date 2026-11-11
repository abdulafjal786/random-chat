"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, ChatStatus, WSIncomingEvent } from "@/types";

const WS_BASE = (
  process.env.NEXT_PUBLIC_WS_URL || "http://192.168.1.37:8000"
).replace(/^http/, "ws");

interface UseChatReturn {
  messages: ChatMessage[];
  status: ChatStatus;
  partnerId: string | null;
  sendMessage: (text: string) => void;
  skip: () => void;
}

export function useChat(userId: string | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [partnerId, setPartnerId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualSkipRef = useRef(false);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (!userId) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_BASE}/ws/chat/${userId}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("searching");
    };

    ws.onmessage = (event) => {
      try {
        const data: WSIncomingEvent = JSON.parse(event.data);

        switch (data.type) {
          case "searching":
            setStatus("searching");
            setPartnerId(null);
            break;

          case "matched":
            setStatus("connected");
            setPartnerId(data.partner_id || null);
            setMessages([]);
            break;

          case "message":
            setMessages((prev) => [
              ...prev,
              {
                id: uuidv4(),
                sender: data.sender || "stranger",
                text: data.text || "",
                timestamp: data.timestamp || new Date().toISOString(),
                isOwn: data.sender === userId,
              },
            ]);
            break;

          case "disconnected":
            setStatus("disconnected");
            setPartnerId(null);
            if (!manualSkipRef.current) {
              clearReconnectTimer();
              reconnectTimerRef.current = setTimeout(() => {
                connect();
              }, 5000);
            }
            manualSkipRef.current = false;
            break;
        }
      } catch {
        console.error("Failed to parse WS message");
      }
    };

    ws.onclose = () => {
      if (!manualSkipRef.current) {
        setStatus("disconnected");
        clearReconnectTimer();
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 5000);
      }
      manualSkipRef.current = false;
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [userId]);

  useEffect(() => {
    if (userId) connect();
    return () => {
      clearReconnectTimer();
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && text.trim()) {
        wsRef.current.send(JSON.stringify({ type: "message", text }));
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            sender: userId || "",
            text,
            timestamp: new Date().toISOString(),
            isOwn: true,
          },
        ]);
      }
    },
    [userId]
  );

  const skip = useCallback(() => {
    manualSkipRef.current = true;
    clearReconnectTimer();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "skip" }));
    }
    setStatus("searching");
    setPartnerId(null);
    setMessages([]);
  }, []);

  return { messages, status, partnerId, sendMessage, skip };
}

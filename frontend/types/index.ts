export interface ChatUser {
  user_id: string;
  created: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  created_at: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  updated_at: string;
  published: boolean;
}

export type ChatStatus = "idle" | "searching" | "connected" | "disconnected";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export type WSEventType =
  | "searching"
  | "matched"
  | "message"
  | "disconnected"
  | "skip";

export interface WSIncomingEvent {
  type: WSEventType;
  partner_id?: string;
  sender?: string;
  text?: string;
  timestamp?: string;
}

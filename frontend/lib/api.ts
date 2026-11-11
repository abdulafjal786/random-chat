import { BlogPost, BlogPostDetail, ChatUser } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function registerUser(userId: string): Promise<ChatUser> {
  return apiFetch<ChatUser>("/api/register/", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>("/api/blog/posts/");
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail> {
  return apiFetch<BlogPostDetail>(`/api/blog/posts/${slug}/`);
}

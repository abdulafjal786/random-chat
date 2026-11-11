import { getBlogPosts } from "@/lib/api";
import { BlogPost } from "@/types";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    // Backend may not be running during build
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <header className="border-b border-gray-800/60 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            💬
          </div>
          <span className="text-white font-bold text-sm">RandomChat</span>
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-400 text-sm">Blog</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Blog</span>
          <h1 className="text-4xl font-black text-white mt-2 leading-tight">Stories & Insights</h1>
          <p className="text-gray-400 mt-3">
            Tips, community stories, and updates from the RandomChat team.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <span className="text-4xl block mb-4">📝</span>
            <p>No posts yet — start the backend to load blog content.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { getBlogPost } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <Link href="/blog" className="text-gray-400 text-sm hover:text-violet-400 transition-colors">Blog</Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-500 text-sm truncate max-w-[200px]">{post.title}</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors mb-8"
        >
          ← Back to Blog
        </Link>

        <article>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-violet-400 font-semibold uppercase tracking-widest">
              {post.author}
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-6">
            {post.title}
          </h1>

          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

import Link from "next/link";
import { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-700/60 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-violet-400 font-semibold uppercase tracking-widest">
            {post.author}
          </span>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <h2 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-violet-300 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {post.excerpt || post.title}
        </p>
        <div className="mt-4 text-violet-500 text-sm font-semibold group-hover:text-violet-400 transition-colors">
          Read more →
        </div>
      </article>
    </Link>
  );
}

import Link from "next/link";

export default function AdPanel() {
  return (
    <aside className="flex flex-col gap-4 h-full">
      {/* Blog CTA */}
      <Link
        href="/blog"
        className="group block bg-gradient-to-br from-violet-900/60 to-purple-900/40 border border-violet-700/50 rounded-2xl p-5 hover:border-violet-500/70 transition-all duration-200"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">✍️</span>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
            Blog
          </span>
        </div>
        <h3 className="text-white font-bold text-base leading-tight mb-1">
          Read Our Blog
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          Tips, stories, and insights from the RandomChat community.
        </p>
        <div className="mt-3 text-violet-400 text-xs font-semibold group-hover:text-violet-300 transition-colors">
          Read now →
        </div>
      </Link>

      {/* Ad unit 1 */}
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[140px] gap-2">
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl">
          📣
        </div>
        <span className="text-gray-600 text-xs uppercase tracking-widest font-semibold">
          Advertisement
        </span>
        <div className="w-full h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg mt-1" />
      </div>

      {/* Ad unit 2 */}
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[120px] gap-2">
        <span className="text-gray-600 text-xs uppercase tracking-widest font-semibold">
          Sponsored
        </span>
        <div className="w-full h-16 bg-gradient-to-r from-violet-900/30 to-gray-800 rounded-lg" />
        <p className="text-gray-600 text-xs text-center">
          Your ad could be here
        </p>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-5">
        <h4 className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-3">
          Live Stats
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Online now</span>
            <span className="text-emerald-400 text-xs font-bold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              1,284
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Chats today</span>
            <span className="text-violet-400 text-xs font-bold">48,921</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "The future of quantum computing",
  "How mRNA vaccines are reshaping medicine",
  "The rise of edge AI in autonomous systems",
  "Climate tipping points and feedback loops",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? `Server error ${res.status}`);
      }
      const data = await res.json();
      router.push(`/blog/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#fafaf9]">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-stone-200">
        <span className="font-bold text-lg tracking-tight text-slate-900">
          ResearchInk
        </span>
        <span className="text-xs text-stone-400 font-mono">
          powered by AWS Bedrock
        </span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Live web + academic research
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 text-center leading-tight mb-4 max-w-2xl">
          Research to blog,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            in seconds.
          </span>
        </h1>

        <p className="text-lg text-stone-500 text-center max-w-lg mb-10">
          Enter any topic. ResearchInk pulls live web sources and academic
          papers, then writes a publication-ready blog post with AI-generated
          visuals.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex gap-2 p-2 bg-white border border-stone-200 rounded-xl shadow-sm">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to research…"
              className="flex-1 bg-transparent px-3 py-2 text-base text-slate-900 placeholder:text-stone-400 focus:outline-none"
              disabled={loading}
              maxLength={200}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading ? "Generating…" : "Generate Blog"}
            </button>
          </div>

          {loading && (
            <div className="mt-4 flex items-center gap-3 text-sm text-stone-500 justify-center">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-slate-700" />
              Researching the web and arXiv, then writing your blog…
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
          )}
        </form>

        {/* Example chips */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-xl">
          <span className="text-xs text-stone-400 self-center">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setTopic(ex)}
              disabled={loading}
              className="text-xs border border-stone-200 bg-white text-stone-600 px-3 py-1.5 rounded-full hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-stone-400 border-t border-stone-200">
        Tavily · arXiv · AWS Bedrock Claude · Titan Image Generator
      </footer>
    </main>
  );
}

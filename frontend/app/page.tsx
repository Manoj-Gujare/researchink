"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: topic.trim() }),
        }
      );
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo / brand */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-3xl">🖊️</span>
        <span className="text-3xl font-bold tracking-tight">ResearchInk</span>
      </div>
      <p className="text-gray-500 mb-10 text-center max-w-md">
        Turn any topic into a publication-ready blog post — powered by live web
        research, academic papers, and AI-generated visuals.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col gap-3"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The future of quantum computing"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50"
            disabled={loading}
            maxLength={200}
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
            Researching and writing your blog — this takes about 30–60 seconds…
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </form>

      <p className="mt-16 text-xs text-gray-400">
        Powered by AWS Bedrock · Tavily · Arxiv
      </p>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        }
      );
      const data = await res.json();
      router.push(`/blog/${data.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-3">
        ResearchInk
      </h1>
      <p className="text-lg text-gray-500 mb-10">
        Turn any topic into a publication-ready blog post.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The future of quantum computing"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>
    </main>
  );
}

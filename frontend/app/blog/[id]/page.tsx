import BlogRenderer from "@/components/BlogRenderer";
import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

async function getBlog(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getBlog(params.id);

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafaf9]">
        <p className="text-lg text-stone-600">Blog post not found.</p>
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-slate-900 underline underline-offset-4"
        >
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-10 bg-[#fafaf9]/80 backdrop-blur border-b border-stone-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            ← ResearchInk
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 font-mono">
              {data.blog.reading_time}
            </span>
            <DownloadButton blog={data.blog} />
          </div>
        </div>
      </nav>
      <BlogRenderer blog={data.blog} />
    </>
  );
}

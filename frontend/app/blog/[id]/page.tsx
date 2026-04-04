import BlogRenderer from "@/components/BlogRenderer";
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
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">Blog post not found.</p>
        <Link href="/" className="text-sm underline text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
      </main>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-gray-900">
            🖊️ ResearchInk
          </Link>
          <span className="text-sm text-gray-400">{data.blog.reading_time}</span>
        </div>
      </nav>
      <BlogRenderer blog={data.blog} />
    </>
  );
}

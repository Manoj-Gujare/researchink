import BlogRenderer from "@/components/BlogRenderer";

async function getBlog(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}

export default async function BlogPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getBlog(params.id);
  return <BlogRenderer blog={data.blog} />;
}

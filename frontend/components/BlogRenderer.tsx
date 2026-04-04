"use client";

import { useEffect } from "react";
import type { BlogPost } from "@/types/blog";

function clean(text: string): string {
  return text.replace(/\u2014/g, " - ").replace(/\u2013/g, "-");
}

function ReadingProgress() {
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;
    function update() {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      bar!.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div id="reading-progress" />;
}

export default function BlogRenderer({ blog }: { blog: BlogPost }) {
  return (
    <>
      <ReadingProgress />
      <article className="max-w-2xl mx-auto px-4 py-14">
        {/* Hero image */}
        {blog.hero_image_b64 && (
          <div className="mb-10 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden shadow-md">
            <img
              src={`data:image/png;base64,${blog.hero_image_b64}`}
              alt={blog.title}
              className="w-full object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title + subtitle */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900 mb-4">
          {clean(blog.title)}
        </h1>
        <p className="text-xl text-stone-500 leading-relaxed mb-3">
          {clean(blog.subtitle)}
        </p>
        <p className="text-sm text-stone-400 mb-10">{blog.reading_time}</p>

        {/* Intro */}
        <div className="mb-12 p-5 bg-slate-50 border-l-4 border-slate-900 rounded-r-xl">
          <p className="text-lg font-semibold text-slate-900 mb-2 leading-snug">
            {clean(blog.intro.hook)}
          </p>
          <p className="text-stone-700 mb-2">{clean(blog.intro.context)}</p>
          <p className="text-stone-500 text-sm italic">
            {clean(blog.intro.what_you_will_learn)}
          </p>
        </div>

        {/* Sections */}
        {blog.sections.map((section, i) => (
          <section key={i} className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-5 leading-snug">
              {clean(section.heading)}
            </h2>

            {section.image_b64 && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={`data:image/png;base64,${section.image_b64}`}
                  alt={section.heading}
                  className="w-full object-cover max-h-[360px]"
                />
              </div>
            )}

            <div className="prose prose-stone max-w-none text-stone-700 leading-[1.85] whitespace-pre-line mb-6">
              {clean(section.content)}
            </div>

            {/* Key insight callout */}
            <div className="my-6 flex gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <span className="text-indigo-500 text-xl select-none mt-0.5">
                ✦
              </span>
              <p className="font-semibold text-indigo-900 text-sm leading-relaxed">
                {clean(section.key_insight)}
              </p>
            </div>

            {/* Sources */}
            {section.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-xs text-stone-400">Sources:</span>
                {section.sources.map((src, j) =>
                  src.startsWith("http") ? (
                    <a
                      key={j}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      [{j + 1}]
                    </a>
                  ) : (
                    <span key={j} className="text-xs text-stone-400">
                      [{j + 1}] {src}
                    </span>
                  )
                )}
              </div>
            )}
          </section>
        ))}

        {/* Key takeaways */}
        <section className="mb-12 p-6 bg-slate-900 text-white rounded-2xl">
          <h2 className="text-base font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Key Takeaways
          </h2>
          <ul className="space-y-3">
            {blog.key_takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="text-indigo-400 font-bold select-none mt-0.5">
                  0{i + 1}
                </span>
                <span>{clean(t)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Conclusion
          </h2>
          <p className="text-stone-700 leading-relaxed mb-3">
            {clean(blog.conclusion.summary)}
          </p>
          <p className="text-stone-500 italic text-sm">
            {clean(blog.conclusion.forward_look)}
          </p>
        </section>

        {/* References */}
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-5">
            References
          </h2>
          <ul className="space-y-3">
            {blog.references.map((ref, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span
                  className={`mt-0.5 shrink-0 px-1.5 py-0.5 text-xs rounded font-semibold ${
                    ref.type === "arxiv"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {ref.type}
                </span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-slate-900 hover:underline"
                >
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}

import type { BlogPost } from "@/types/blog";

export default function BlogRenderer({ blog }: { blog: BlogPost }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero image */}
      {blog.hero_image_b64 && (
        <img
          src={`data:image/png;base64,${blog.hero_image_b64}`}
          alt={blog.title}
          className="w-full rounded-2xl mb-10 object-cover max-h-[480px]"
        />
      )}

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-3">
          {blog.title}
        </h1>
        <p className="text-xl text-gray-500">{blog.subtitle}</p>
      </header>

      {/* Intro */}
      <section className="mb-12 border-l-4 border-gray-900 pl-5">
        <p className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
          {blog.intro.hook}
        </p>
        <p className="text-gray-700 mb-3">{blog.intro.context}</p>
        <p className="text-gray-500 italic">{blog.intro.what_you_will_learn}</p>
      </section>

      {/* Sections */}
      {blog.sections.map((section, i) => (
        <section key={i} className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            {section.heading}
          </h2>

          {section.image_b64 && (
            <img
              src={`data:image/png;base64,${section.image_b64}`}
              alt={section.heading}
              className="w-full rounded-xl mb-6 object-cover max-h-[360px]"
            />
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
            {section.content}
          </div>

          {/* Key insight callout */}
          <blockquote className="border-l-4 border-gray-900 pl-4 py-2 bg-gray-50 rounded-r-xl">
            <p className="font-semibold text-gray-900">{section.key_insight}</p>
          </blockquote>

          {section.sources.length > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              Sources: {section.sources.join(" · ")}
            </p>
          )}
        </section>
      ))}

      {/* Key takeaways */}
      <section className="mb-12 bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <ul className="space-y-2">
          {blog.key_takeaways.map((t, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-gray-400 select-none">→</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Conclusion */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
        <p className="text-gray-700 mb-3">{blog.conclusion.summary}</p>
        <p className="text-gray-500 italic">{blog.conclusion.forward_look}</p>
      </section>

      {/* References */}
      <section className="border-t border-gray-100 pt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">References</h2>
        <ul className="space-y-3">
          {blog.references.map((ref, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span
                className={`mt-0.5 shrink-0 px-1.5 py-0.5 text-xs rounded font-medium ${
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
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

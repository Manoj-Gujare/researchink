import type { BlogPost } from "@/types/blog";

export function blogToMarkdown(blog: BlogPost): string {
  const lines: string[] = [];

  lines.push(`# ${blog.title}`);
  lines.push("");
  lines.push(`> ${blog.subtitle}`);
  lines.push("");
  lines.push(
    `**Tags:** ${blog.tags.join(", ")}  |  **Reading time:** ${blog.reading_time}`
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  // Intro
  lines.push("## Introduction");
  lines.push("");
  lines.push(blog.intro.hook);
  lines.push("");
  lines.push(blog.intro.context);
  lines.push("");
  lines.push(`*${blog.intro.what_you_will_learn}*`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Sections
  for (const section of blog.sections) {
    lines.push(`## ${section.heading}`);
    lines.push("");
    lines.push(section.content);
    lines.push("");
    lines.push(`> **Key Insight:** ${section.key_insight}`);
    lines.push("");
    if (section.sources.length > 0) {
      lines.push(
        `*Sources: ${section.sources
          .map((s, i) => (s.startsWith("http") ? `[[${i + 1}]](${s})` : s))
          .join(" · ")}*`
      );
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  // Key takeaways
  lines.push("## Key Takeaways");
  lines.push("");
  for (const t of blog.key_takeaways) {
    lines.push(`- ${t}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // Conclusion
  lines.push("## Conclusion");
  lines.push("");
  lines.push(blog.conclusion.summary);
  lines.push("");
  lines.push(`*${blog.conclusion.forward_look}*`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // References
  lines.push("## References");
  lines.push("");
  for (const ref of blog.references) {
    lines.push(`- **[${ref.type.toUpperCase()}]** [${ref.title}](${ref.url})`);
  }

  return lines.join("\n");
}

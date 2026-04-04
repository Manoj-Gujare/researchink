"use client";

import { useState } from "react";
import JSZip from "jszip";
import type { BlogPost } from "@/types/blog";
import { blogToMarkdown } from "@/lib/blogToMarkdown";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function b64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export default function DownloadButton({ blog }: { blog: BlogPost }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const zip = new JSZip();
      const slug = slugify(blog.title);

      // Markdown
      zip.file(`${slug}.md`, blogToMarkdown(blog));

      // Images folder
      const imgFolder = zip.folder("images")!;

      if (blog.hero_image_b64) {
        imgFolder.file("hero.png", b64ToUint8(blog.hero_image_b64));
      }

      blog.sections.forEach((section, i) => {
        if (section.image_b64) {
          const name = `section-${i + 1}-${slugify(section.heading)}.png`;
          imgFolder.file(name, b64ToUint8(section.image_b64));
        }
      });

      const blob = await zip.generateAsync({ type: "blob" });

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          Zipping…
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download ZIP
        </>
      )}
    </button>
  );
}

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LegalLayoutProps {
  sourceUrl: string;
}

export function LegalLayout({ sourceUrl }: LegalLayoutProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(sourceUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.text();
      })
      .then((text) => setContent(text))
      .catch((err) => console.error("Failed to load markdown:", err));
  }, [sourceUrl]);

  // Very simple regex parser for markdown
  const parseMarkdownToHTML = (md: string) => {
    let parsed = md
      .replace(/^#\s+(.*$)/gm, '<h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-12">$1</h1>')
      .replace(/^##\s+(.*$)/gm, '<h2 class="text-xl md:text-2xl font-bold tracking-tight text-[#8C0B0C] mt-12 mb-6 uppercase">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\\\-/g, '-') // Handle escaped dashes
      .replace(/\\/g, ''); // Handle other escapes

    // Handle lists
    parsed = parsed.replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 list-disc text-neutral-400">$1</li>');

    // Wrap paragraphs (anything not starting with <)
    const blocks = parsed.split(/\n\n+/);
    const htmlBlocks = blocks.map(block => {
      let trimmed = block.trim();
      if (!trimmed) return "";
      
      // If it contains a list item but isn't wrapped in ul, let's just leave it or wrap the whole block
      if (trimmed.includes('<li')) {
        return `<ul class="mb-6">${trimmed}</ul>`;
      }
      
      if (trimmed.startsWith('<h1') || trimmed.startsWith('<h2')) {
        return trimmed;
      }
      
      return `<p class="mb-6 text-neutral-400 leading-relaxed">${trimmed}</p>`;
    });

    return htmlBlocks.join('\n');
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-[5%] max-w-4xl mx-auto min-h-screen selection:bg-[#8C0B0C] selection:text-white">
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(content) }}
      />
    </div>
  );
}
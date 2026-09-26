"use client";

import type { CSSProperties, ElementType } from "react";
import { useReveal } from "@/components/reveal";

/**
 * Word-by-word masked reveal: each word rises out of its own clip as the
 * heading scrolls into view. Wrap words in _underscores_ to set them in the
 * italic serif, e.g. "What it _costs._"
 */
export function SplitReveal({
  children,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.06,
}: {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const [ref, reveal] = useReveal<HTMLElement>(delay);
  // Resolve which words sit inside _underscores_ before rendering.
  const words: { text: string; italic: boolean }[] = [];
  let italic = false;
  for (const raw of children.split(/\s+/)) {
    if (raw.startsWith("_")) italic = true;
    words.push({ text: raw.replace(/_/g, ""), italic });
    if (/_[.,!?]?$/.test(raw)) italic = false;
  }

  return (
    <Tag
      ref={ref}
      aria-label={children.replace(/_/g, "")}
      className={`split ${reveal.className.includes(" in") ? "in" : ""} ${className}`}
      style={reveal.style}
    >
      {words.map(({ text: word, italic: isItalic }, i) => {
        const inner = (
          <span className="split-word" style={{ "--i": i, "--s": `${stagger}s` } as CSSProperties}>
            {word}
          </span>
        );
        return (
          <span key={i} aria-hidden="true">
            <span className="split-mask">{isItalic ? <em>{inner}</em> : inner}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}

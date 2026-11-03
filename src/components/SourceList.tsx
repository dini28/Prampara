import type { Source } from "@/lib/types";

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="space-y-3 border-t border-[var(--line)] pt-5">
      {sources.map((s, i) => (
        <li key={s.id} className="text-sm leading-relaxed">
          <span className="mr-2 font-medium text-[var(--ink-soft)]">{i + 1}.</span>
          <a href={s.url} className="text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]" target="_blank" rel="noreferrer">
            {s.title}
          </a>
          <span className="text-[var(--ink-soft)]">
            {" "}
            — {s.publisher} · accessed {s.accessed_on}
          </span>
        </li>
      ))}
    </ol>
  );
}

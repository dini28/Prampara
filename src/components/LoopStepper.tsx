import Link from "next/link";
import { LEARNER_LOOP, type LoopStepId } from "@/lib/project";

export function LoopStepper({
  current,
  itemSlug,
}: {
  current: LoopStepId;
  /** When set, Ask / Quiz / Contribute steps deep-link to this card. */
  itemSlug?: string;
}) {
  return (
    <nav aria-label="Learner loop" className="loop-stepper">
      <ol className="flex flex-wrap gap-2">
        {LEARNER_LOOP.map((step) => {
          const active = step.id === current;
          const href =
            itemSlug && (step.id === "card" || step.id === "ask" || step.id === "quiz" || step.id === "contribute")
              ? step.id === "card"
                ? `/items/${itemSlug}`
                : `/items/${itemSlug}/${step.id}`
              : step.href;

          return (
            <li key={step.id}>
              <Link
                href={href}
                aria-current={active ? "step" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm outline outline-1 transition-[background-color,outline-color,color] duration-200 ${
                  active
                    ? "bg-[var(--primary)] text-[var(--on-primary)] outline-[var(--primary)]"
                    : "bg-[var(--bg)] text-[var(--ink-soft)] outline-[var(--line)] hover:outline-[var(--primary)] hover:text-[var(--ink)]"
                }`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-[11px] font-semibold tabular-nums ${
                    active ? "bg-[var(--on-primary)]/20" : "bg-[var(--surface)] text-[var(--muted)]"
                  }`}
                >
                  {step.step}
                </span>
                <span className="font-medium">{step.title}</span>
                <span className={`hidden sm:inline ${active ? "text-[var(--on-primary)]/80" : "text-[var(--muted)]"}`}>
                  · {step.short}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

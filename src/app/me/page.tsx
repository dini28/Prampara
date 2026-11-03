import { clearLearner } from "@/app/login/actions";
import { getLearnerName } from "@/lib/learner";
import { getItemBySlug } from "@/lib/catalogue";
import { DEMO_PATH, LEARNER_LOOP } from "@/lib/project";
import {
  analyseUserRequirements,
  summariseRequirementAnalysis,
} from "@/lib/requirement-status";
import { listQuizzes } from "@/lib/runtime-store";
import Link from "next/link";

const STATE_STYLE = {
  met: "bg-[var(--verified-tint)] text-[var(--verified)]",
  partial: "bg-[var(--primary-tint)] text-[var(--primary-deep)]",
  ready: "bg-[var(--surface)] text-[var(--muted)] outline outline-1 outline-[var(--line)]",
  unmet: "bg-[var(--bg)] text-[var(--danger)] outline outline-1 outline-[var(--danger)]/30",
} as const;

const STATE_LABEL = {
  met: "Met",
  partial: "Partial",
  ready: "Ready to verify",
  unmet: "Not yet",
} as const;

export default async function MePage() {
  const learner = await getLearnerName();
  const scores = listQuizzes(learner ?? "guest");
  const analysis = analyseUserRequirements(learner);
  const summary = summariseRequirementAnalysis(analysis);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-sm font-medium text-[var(--primary)]">Live requirements analysis</p>
      <h1 className="serif mt-2 text-5xl">Your path</h1>
      <p className="mt-4 text-[var(--ink-soft)]">
        Run the demo loop, then return here. Runtime signals (Ask, Quiz, contributions) update
        automatically so you can analyse which user requirements are already met.
      </p>

      {learner ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]">
          <p className="text-sm">
            Local name: <strong className="text-[var(--ink)]">{learner}</strong>
          </p>
          <form action={clearLearner}>
            <button className="text-sm text-[var(--primary)] underline underline-offset-4" type="submit">
              Clear name
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-6 text-[var(--muted)]">
          Browsing as guest.{" "}
          <Link href="/login" className="text-[var(--primary)] underline underline-offset-4">
            Set a local name
          </Link>{" "}
          so quiz scores attach to UR-06.
        </p>
      )}

      <section className="mt-10" aria-labelledby="summary">
        <h2 id="summary" className="serif text-2xl">
          Analysis summary
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
            <dt className="text-xs text-[var(--muted)]">Met</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--verified)]">
              {summary.met}
              <span className="text-sm font-normal text-[var(--muted)]">/{summary.total}</span>
            </dd>
          </div>
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
            <dt className="text-xs text-[var(--muted)]">Partial</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--primary)]">
              {summary.partial}
              <span className="text-sm font-normal text-[var(--muted)]">/{summary.total}</span>
            </dd>
          </div>
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
            <dt className="text-xs text-[var(--muted)]">Ready</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--muted)]">
              {summary.ready}
              <span className="text-sm font-normal text-[var(--muted)]">/{summary.total}</span>
            </dd>
          </div>
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
            <dt className="text-xs text-[var(--muted)]">Not yet</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--danger)]">
              {summary.unmet}
              <span className="text-sm font-normal text-[var(--muted)]">/{summary.total}</span>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Met / Partial update from Ask log, quiz scores, and contribution queue. Ready items are
          verified by opening the linked screen.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="ur-status">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ur-status" className="serif text-2xl">
            Requirement status
          </h2>
          <Link
            href="/about#requirements"
            className="text-sm text-[var(--primary)] underline underline-offset-4"
          >
            Full UR definitions
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {analysis.map(({ requirement, state, detail }) => (
            <li
              key={requirement.id}
              className="rounded-2xl bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold tabular-nums text-[var(--primary)]">
                  {requirement.id}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATE_STYLE[state]}`}
                >
                  {STATE_LABEL[state]}
                </span>
                <span className="text-xs text-[var(--muted)]">{requirement.priority}</span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-[var(--ink)]">{requirement.need}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{detail}</p>
              <Link
                href={requirement.href}
                className="mt-2 inline-block text-sm text-[var(--primary)] underline underline-offset-4"
              >
                Verify →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="checklist">
        <h2 id="checklist" className="serif text-2xl">
          Demo checklist
        </h2>
        <ol className="mt-4 space-y-3">
          {DEMO_PATH.map((line, i) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--primary-tint)] text-xs font-semibold text-[var(--primary-deep)] tabular-nums">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-[var(--ink)]">{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="steps">
        <h2 id="steps" className="serif text-2xl">
          Jump to a loop step
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {LEARNER_LOOP.map((step) => (
            <li key={step.id}>
              <Link
                href={step.href}
                className="inline-flex min-h-10 items-center rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]"
              >
                {step.step}. {step.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="serif text-2xl">Quiz scores (UR-06)</h2>
        {scores.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No scores yet — finish a card quiz.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {scores.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
              >
                <span>{getItemBySlug(s.itemSlug)?.title ?? s.itemSlug}</span>
                <span className="font-medium tabular-nums text-[var(--verified)]">
                  {s.score}/{s.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/items/kalbelia"
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Start demo loop
        </Link>
        <Link
          href="/about#users"
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 hover:border-[var(--primary)]"
        >
          Users & UR table
        </Link>
      </div>
    </main>
  );
}

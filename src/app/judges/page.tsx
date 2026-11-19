import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import {
  DEMO_PATH,
  DEMO_SCRIPT_90S,
  ETHICS_NOTES,
  NEEDS_HUMAN_VERIFICATION,
  OUT_OF_SCOPE,
  PERSONAS,
  PITCH_OUTLINE,
  PROJECT_AIMS,
  USER_REQUIREMENTS,
  LEARNER_LOOP,
} from "@/lib/project";
import { getLearnerName } from "@/lib/learner";
import { getItemBySlug } from "@/lib/catalogue";
import {
  analyseUserRequirements,
  summariseRequirementAnalysis,
} from "@/lib/requirement-status";
import { listQuizzes } from "@/lib/runtime-store";
import { buildCoverageMatrix, COVERAGE_TYPES } from "@/lib/coverage-matrix";

export const metadata = {
  title: "For judges · Parampara Path",
  description:
    "SIH jury notes: user requirements, demo path, live verification, ethics, and positioning.",
  robots: { index: false, follow: false },
};

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

export default async function JudgesPage() {
  const must = USER_REQUIREMENTS.filter((r) => r.priority === "Must");
  const should = USER_REQUIREMENTS.filter((r) => r.priority === "Should");
  const learner = await getLearnerName();
  const scores = listQuizzes(learner ?? "guest");
  const analysis = analyseUserRequirements(learner);
  const summary = summariseRequirementAnalysis(analysis);
  const coverage = buildCoverageMatrix();

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "For judges" }]}
      eyebrow="Judge and developer material"
      title="Requirements, demo path, and live verification"
      lead="This page is not in the learner nav. It holds SIH user requirements, ethics notes, and a live checklist for the viva."
      nextHref="/map"
      nextLabel="Open learner map"
      secondaryHref="/items/kalbelia"
      secondaryLabel="Kalbelia demo card"
    >
      <p className="mb-10 text-sm text-[var(--ink-soft)]">
        Prefer a walkthrough?{" "}
        <Link href="/items/kalbelia" className="text-[var(--primary)] underline underline-offset-4">
          Run the Kalbelia demo loop
        </Link>
        .
      </p>

      <section id="coverage" className="mb-14" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading" className="serif text-3xl">
          Coverage of India
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Breadth rollout: published cards across states and UTs. Empty cells are honest gaps, not
          invented entries. Regenerate docs with{" "}
          <code className="text-xs">pnpm coverage</code>.
        </p>
        <p className="mt-4 text-sm tabular-nums text-[var(--ink)]">
          {coverage.coveredCount} / {coverage.totalStates} states & UTs · {coverage.publishedCards}{" "}
          published cards
          {coverage.missingSlugs.length
            ? ` · still empty: ${coverage.missingSlugs.join(", ")}`
            : " · no empty states"}
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl outline outline-1 outline-[var(--line)]">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-[var(--surface)]">
              <tr>
                <th className="px-3 py-2 font-semibold">State / UT</th>
                <th className="px-3 py-2 font-semibold tabular-nums">Total</th>
                {COVERAGE_TYPES.map((t) => (
                  <th key={t} className="px-2 py-2 font-semibold capitalize">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverage.rows.map((row) => (
                <tr key={row.slug} className="border-t border-[var(--line)]">
                  <td className="px-3 py-2">
                    <Link href={`/places/${row.slug}`} className="text-[var(--primary)] underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{row.total}</td>
                  {COVERAGE_TYPES.map((t) => (
                    <td key={t} className="px-2 py-2 tabular-nums text-[var(--muted)]">
                      {row.types[t] || "·"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="users" aria-labelledby="users-heading">
        <h2 id="users-heading" className="serif text-3xl">
          Users
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Requirements are written from these personas, not from a feature wishlist.
        </p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                {p.role}
              </p>
              <h3 className="serif mt-2 text-xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{p.context}</p>
              <p className="mt-4 text-xs font-semibold text-[var(--muted)]">Goals</p>
              <ul className="mt-1 space-y-1 text-sm text-[var(--ink)]">
                {p.goals.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span className="text-[var(--verified)]" aria-hidden="true">
                      ✓
                    </span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold text-[var(--muted)]">Pains</p>
              <ul className="mt-1 space-y-1 text-sm text-[var(--ink-soft)]">
                {p.pains.map((pain) => (
                  <li key={pain}>· {pain}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" id="requirements" aria-labelledby="req-heading">
        <h2 id="req-heading" className="serif text-3xl">
          User requirements
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          {must.length} Must · {should.length} Should. Each row states the need, why it matters, and
          the acceptance test a jury can run.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl outline outline-1 outline-[var(--line)]">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Pri.</th>
                <th className="px-3 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Need</th>
                <th className="px-3 py-3 font-medium">Analysis</th>
                <th className="px-3 py-3 font-medium">Acceptance</th>
                <th className="px-3 py-3 font-medium">Verify</th>
              </tr>
            </thead>
            <tbody>
              {USER_REQUIREMENTS.map((ur) => (
                <tr key={ur.id} className="border-t border-[var(--line)] align-top">
                  <td className="px-3 py-3 font-semibold tabular-nums text-[var(--primary)]">
                    {ur.id}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        ur.priority === "Must"
                          ? "rounded-full bg-[var(--primary-tint)] px-2 py-0.5 text-xs font-medium text-[var(--primary-deep)]"
                          : "rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-medium outline outline-1 outline-[var(--line)]"
                      }
                    >
                      {ur.priority}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[var(--ink)]">{ur.user}</td>
                  <td className="px-3 py-3 font-medium text-[var(--ink)]">{ur.need}</td>
                  <td className="max-w-[16rem] px-3 py-3 text-[var(--ink-soft)]">{ur.analysis}</td>
                  <td className="max-w-[14rem] px-3 py-3 text-[var(--ink-soft)]">{ur.acceptance}</td>
                  <td className="px-3 py-3">
                    <Link
                      href={ur.href}
                      className="text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" id="live-analysis" aria-labelledby="live-heading">
        <h2 id="live-heading" className="serif text-3xl">
          Live requirements analysis
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Met / Partial update from Ask log, quiz scores, and contribution queue. Ready items are
          verified by opening the linked screen.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <ul className="mt-6 space-y-3">
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
        <h3 className="serif mt-10 text-xl">Quiz scores (UR-06)</h3>
        {scores.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No scores yet , finish a card quiz.</p>
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

      <section className="mt-16" aria-labelledby="aims">
        <h2 id="aims" className="serif text-3xl">
          Project aims (from user needs)
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {PROJECT_AIMS.map((aim) => (
            <li
              key={aim.title}
              className="rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]"
            >
              <h3 className="serif text-xl">{aim.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{aim.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="loop">
        <h2 id="loop" className="serif text-3xl">
          Loop ↔ requirements
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Traceability: each step of the eight-minute journey closes specific URs.
        </p>
        <ol className="mt-8 space-y-4">
          {LEARNER_LOOP.map((step) => (
            <li key={step.id} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--primary-tint)] text-sm font-semibold text-[var(--primary-deep)] tabular-nums">
                {step.step}
              </span>
              <div>
                <p className="font-medium text-[var(--ink)]">
                  {step.title}{" "}
                  <span className="font-normal text-[var(--muted)]">· {step.short}</span>
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                  {step.body}
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--primary)]">
                  Satisfies {step.needIds.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2" aria-labelledby="demo">
        <div>
          <h2 id="demo" className="serif text-3xl">
            Jury demo path
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-[var(--ink-soft)]">
            {DEMO_PATH.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ol>
          <h3 className="serif mt-8 text-xl">90-second script</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
            {DEMO_SCRIPT_90S.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ol>
          <h3 className="serif mt-8 text-xl">Pitch outline</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
            {PITCH_OUTLINE.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--muted)]" aria-hidden="true">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="serif text-3xl">Out of scope</h2>
          <ul className="mt-5 space-y-2 text-[var(--ink-soft)]">
            {OUT_OF_SCOPE.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--muted)]" aria-hidden="true">
                  ·
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3 className="serif mt-8 text-xl">Needs human verification</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
            {NEEDS_HUMAN_VERIFICATION.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--muted)]" aria-hidden="true">
                  ·
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="mt-16 rounded-2xl bg-[var(--surface)] p-6 outline outline-1 outline-[var(--line)]"
        id="ethics"
        aria-labelledby="ethics-heading"
      >
        <h2 id="ethics-heading" className="serif text-2xl">
          Ethics and accessibility (UR-11 · UR-12)
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
          {ETHICS_NOTES.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
      </section>

      <section
        className="mt-8 rounded-2xl bg-[var(--bg)] p-6 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]"
        id="positioning"
        aria-labelledby="positioning"
      >
        <h2 id="positioning-title" className="serif text-2xl">
          Positioning (UR-10)
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">
          Unofficial learner tool. Not affiliated with the Ministry of Culture, UNESCO, AICTE, or
          Sahapedia. We point learners to official pages; we do not compete with the national
          archive. AI is a retrieval interface over team-written, cited cards, not an author of
          culture.
        </p>
      </section>

      <section
        id="for-jury"
        className="mt-12 rounded-2xl bg-[var(--primary-tint)] p-6 outline outline-1 outline-[var(--primary)]/20"
        aria-labelledby="jury-heading"
      >
        <h2 id="jury-heading" className="serif text-2xl">
          For jury
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
          Requirements analysis and the moderation desk live outside the learner nav. The reviewer
          desk requires a staff session (secret plus signed cookie). It is not linked from public
          navigation.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--ink)]">
          <li>
            Demo reviewer mode: use the configured staff secret on the obscure desk path from
            environment config.
          </li>
          <li>
            Place pilot:{" "}
            <Link href="/places/rajasthan" className="text-[var(--primary)] underline">
              Rajasthan
            </Link>{" "}
            then{" "}
            <Link href="/places/udaipur" className="text-[var(--primary)] underline">
              Udaipur
            </Link>
            .
          </li>
          <li>
            Card loop:{" "}
            <Link href="/items/kalbelia" className="text-[var(--primary)] underline">
              Kalbelia
            </Link>
            .
          </li>
          <li>
            Learner progress UI:{" "}
            <Link href="/passport" className="text-[var(--primary)] underline">
              Passport
            </Link>
            .
          </li>
        </ul>
      </section>

      <section id="report" className="mt-10 text-sm text-[var(--ink-soft)]">
        <h2 className="serif text-xl text-[var(--ink)]">Report a problem</h2>
        <p className="mt-2">
          If a source link is stale or a place note looks wrong, email the project team via your
          course channel, or submit a contribution note on the related card for human review. Do not
          invent corrections in Ask.
        </p>
      </section>
    </PageShell>
  );
}

import Link from "next/link";
import {
  DEMO_PATH,
  ETHICS_NOTES,
  OUT_OF_SCOPE,
  PERSONAS,
  PROJECT_AIMS,
  USER_REQUIREMENTS,
  LEARNER_LOOP,
} from "@/lib/project";

export const metadata = {
  title: "User requirements — Parampara Path",
  description:
    "User personas, analysed requirements, acceptance criteria, learner loop, and demo path.",
};

export default function AboutPage() {
  const must = USER_REQUIREMENTS.filter((r) => r.priority === "Must");
  const should = USER_REQUIREMENTS.filter((r) => r.priority === "Should");

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm font-medium text-[var(--primary)]">User requirements analysis</p>
      <h1 className="serif mt-2 max-w-[20ch] text-5xl leading-[1.05] md:text-6xl">
        Who needs what — and how we prove it
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
        Every screen is traced to a user need (UR-01…UR-12). Use this page to analyse requirements;
        use <Link href="/me" className="text-[var(--primary)] underline underline-offset-4">Path</Link>{" "}
        to see live verification against Ask, Quiz, and contribution activity.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="#requirements"
          className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Jump to UR table
        </Link>
        <Link
          href="/me"
          className="btn inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-6 hover:border-[var(--primary)]"
        >
          Live analysis on Path
        </Link>
        <Link
          href="/items/kalbelia"
          className="btn inline-flex min-h-12 items-center rounded-full px-4 text-[var(--primary)] underline underline-offset-4"
        >
          Run demo loop
        </Link>
      </div>

      <section className="mt-16" id="users" aria-labelledby="users-heading">
        <h2 id="users-heading" className="serif text-3xl">
          Users
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Requirements are written from these personas — not from a feature wishlist.
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
                  <li key={pain}>— {pain}</li>
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
        </div>
        <div>
          <h2 className="serif text-3xl">Out of scope</h2>
          <ul className="mt-5 space-y-2 text-[var(--ink-soft)]">
            {OUT_OF_SCOPE.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--muted)]" aria-hidden="true">
                  —
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
          Ethics & accessibility (UR-11 · UR-12)
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
          {ETHICS_NOTES.map((note) => (
            <li key={note}>— {note}</li>
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
          archive. AI is a retrieval interface over team-written, cited cards — not an author of
          culture.
        </p>
      </section>
    </main>
  );
}

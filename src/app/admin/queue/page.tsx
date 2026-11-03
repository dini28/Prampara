import { reviewContribution, staffLogout } from "@/app/admin/actions";
import { isStaff } from "@/lib/staff";
import { getItemBySlug } from "@/lib/catalogue";
import { listAsks, listContributions } from "@/lib/runtime-store";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QueuePage() {
  if (!(await isStaff())) redirect("/admin");
  const contrib = listContributions();
  const asks = listAsks();
  const pending = contrib.filter((c) => c.status === "pending").length;
  const grounded = asks.filter((a) => !a.refused).length;
  const refused = asks.filter((a) => a.refused).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">Requirement: human review</p>
          <h1 className="serif mt-1 text-5xl">Moderation queue</h1>
          <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
            Side-by-side card context. Nothing user-submitted is public until accepted. The Ask log
            below shows grounded vs refused answers for the viva.
          </p>
        </div>
        <form action={staffLogout}>
          <button className="btn min-h-10 rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]">
            Sign out reviewer
          </button>
        </form>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]">
          <dt className="text-xs text-[var(--muted)]">Pending contributions</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--ink)]">{pending}</dd>
        </div>
        <div className="rounded-2xl bg-[var(--verified-tint)] px-4 py-3">
          <dt className="text-xs text-[var(--verified)]">Grounded Ask answers</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--verified)]">{grounded}</dd>
        </div>
        <div className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]">
          <dt className="text-xs text-[var(--muted)]">Refused Ask answers</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--ink)]">{refused}</dd>
        </div>
      </dl>

      <section className="mt-12 space-y-5" aria-labelledby="contrib-heading">
        <h2 id="contrib-heading" className="serif text-3xl">
          Contribution queue
        </h2>
        {contrib.length === 0 ? (
          <p className="rounded-2xl bg-[var(--surface)] px-4 py-5 text-sm text-[var(--ink-soft)] outline outline-1 outline-[var(--line)]">
            Queue empty.{" "}
            <Link href="/items/kalbelia/contribute" className="text-[var(--primary)] underline underline-offset-4">
              Submit a contribution from a card
            </Link>{" "}
            to demonstrate the pending → accept/reject path.
          </p>
        ) : null}
        {contrib.map((c) => {
          const item = getItemBySlug(c.itemSlug);
          return (
            <article
              key={c.id}
              className="grid gap-4 rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] md:grid-cols-2"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
                  {c.status} · {c.guestLabel}
                </p>
                <h3 className="serif mt-1 text-2xl">{item?.title ?? c.itemSlug}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
                {c.status === "pending" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={reviewContribution}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="accepted" />
                      <button className="btn min-h-10 rounded-full bg-[var(--primary)] px-4 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]">
                        Accept
                      </button>
                    </form>
                    <form action={reviewContribution}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="btn min-h-10 rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]">
                        Reject
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl bg-[var(--surface)] p-4 text-sm text-[var(--ink-soft)]">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Card context
                </p>
                <p className="mt-2 leading-relaxed">{item?.summary ?? "Card unavailable."}</p>
                {item ? (
                  <Link
                    href={`/items/${item.slug}`}
                    className="mt-3 inline-block text-[var(--primary)] underline underline-offset-4"
                  >
                    Open published card
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-16" aria-labelledby="ask-log">
        <h2 id="ask-log" className="serif text-3xl">
          Ask log
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Shows whether each question was answered from cards or refused — evidence for the
          grounding requirement.
        </p>
        {asks.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            No asks yet.{" "}
            <Link href="/items/kalbelia/ask" className="text-[var(--primary)] underline underline-offset-4">
              Run Ask on Kalbelia
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {asks.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
              >
                <span
                  className={`font-medium ${
                    a.refused ? "text-[var(--muted)]" : "text-[var(--verified)]"
                  }`}
                >
                  {a.refused ? "REFUSED" : "GROUNDED"}
                </span>{" "}
                · {(a.itemSlug && getItemBySlug(a.itemSlug)?.title) || a.itemSlug || "card"} ·{" "}
                {a.question}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

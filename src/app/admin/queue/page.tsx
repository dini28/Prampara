import { reviewContribution, staffLogout } from "@/app/admin/actions";
import { isStaff } from "@/lib/staff";
import { getItemBySlug } from "@/lib/catalogue";
import { listAsks, listContributions } from "@/lib/runtime-store";
import { redirect } from "next/navigation";

export default async function QueuePage() {
  if (!(await isStaff())) redirect("/admin");
  const contrib = listContributions();
  const asks = listAsks();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="serif text-5xl">Moderation</h1>
        <form action={staffLogout}>
          <button className="text-sm underline">Sign out reviewer</button>
        </form>
      </div>
      <p className="mt-3 text-[var(--ink-soft)]">
        Side-by-side item context. Nothing user-submitted is public until accepted.
      </p>
      <section className="mt-10 space-y-5">
        {contrib.length === 0 ? <p>Queue empty — submit a contribution from a card.</p> : null}
        {contrib.map((c) => {
          const item = getItemBySlug(c.itemSlug);
          return (
            <article
              key={c.id}
              className="grid gap-4 rounded-[28px] bg-[var(--paper-2)] p-5 outline outline-1 outline-[var(--line)] md:grid-cols-2"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">
                  {c.status} · {c.guestLabel}
                </p>
                <h2 className="serif mt-1 text-2xl">{item?.title ?? c.itemSlug}</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
                {c.status === "pending" ? (
                  <div className="mt-4 flex gap-2">
                    <form action={reviewContribution}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="accepted" />
                      <button className="btn rounded-full bg-[var(--indigo)] px-4 py-1.5 text-sm text-[var(--paper)]">
                        Accept
                      </button>
                    </form>
                    <form action={reviewContribution}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="btn rounded-full border border-[var(--line)] px-4 py-1.5 text-sm">
                        Reject
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
              <div className="text-sm text-[var(--ink-soft)]">
                <p className="text-xs uppercase tracking-[0.16em]">Card context</p>
                <p className="mt-2">{item?.summary}</p>
              </div>
            </article>
          );
        })}
      </section>
      <section className="mt-16">
        <h2 className="serif text-3xl">Ask log</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {asks.map((a) => (
            <li key={a.id} className="rounded-2xl bg-[var(--paper-2)] px-4 py-3">
              <span className="text-[var(--gold)]">{a.refused ? "REFUSE" : "GROUNDED"}</span> ·{" "}
              {a.itemSlug} · {a.question}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

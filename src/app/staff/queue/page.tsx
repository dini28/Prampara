import {
  reviewContribution,
  staffLogout,
  validateCatalogueDraft,
} from "@/app/staff/actions";
import { CsrfField } from "@/components/CsrfField";
import { getAdminBasePath } from "@/lib/admin-config";
import { getItemBySlug, getRegions, TYPE_LABEL } from "@/lib/catalogue";
import { listAsks, listAudit, listContributions } from "@/lib/runtime-store";
import { isStaff } from "@/lib/staff";
import type { HeritageType } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StaffQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string; ok?: string }>;
}) {
  if (!(await isStaff())) redirect(getAdminBasePath());
  const sp = await searchParams;
  const contrib = listContributions();
  const asks = listAsks();
  const audit = listAudit(40);
  const regions = getRegions();
  const pending = contrib.filter((c) => c.status === "pending").length;
  const grounded = asks.filter((a) => !a.refused).length;
  const refused = asks.filter((a) => a.refused).length;
  const base = getAdminBasePath();

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">Requirement: human review</p>
          <h1 className="serif mt-1 text-4xl sm:text-5xl">Moderation queue</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--ink-soft)] sm:text-base">
            Side-by-side card context. Nothing user-submitted is public until accepted.
          </p>
        </div>
        <form action={staffLogout}>
          <button className="btn min-h-11 touch-manipulation select-none rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]">
            Sign out reviewer
          </button>
        </form>
      </div>

      {sp.error === "csrf" ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          Security check failed. Reload and try again.
        </p>
      ) : null}
      {sp.error === "validation" && sp.msg ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          Validation: {decodeURIComponent(sp.msg)}
        </p>
      ) : null}
      {sp.ok === "validated" ? (
        <p role="status" className="mt-4 text-sm text-[var(--verified)]">
          Place draft passed required-field checks. Logged to audit.
        </p>
      ) : null}

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]">
          <dt className="text-xs text-[var(--muted)]">Pending contributions</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--ink)]">{pending}</dd>
        </div>
        <div className="rounded-2xl bg-[var(--verified-tint)] px-4 py-3">
          <dt className="text-xs text-[var(--verified)]">Grounded Ask answers</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--verified)]">
            {grounded}
          </dd>
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
            Queue empty. Submit a contribution from a card to demonstrate pending → accept/reject.
          </p>
        ) : null}
        {contrib.map((c) => {
          const item = getItemBySlug(c.itemSlug);
          return (
            <article
              key={c.id}
              className="grid gap-4 rounded-2xl bg-[var(--bg)] p-4 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] sm:p-5 md:grid-cols-2"
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
                      <CsrfField />
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="accepted" />
                      <button className="btn min-h-11 touch-manipulation select-none rounded-full bg-[var(--primary)] px-4 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]">
                        Accept
                      </button>
                    </form>
                    <form action={reviewContribution}>
                      <CsrfField />
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="btn min-h-11 touch-manipulation select-none rounded-full border border-[var(--line-strong)] px-4 text-sm hover:border-[var(--primary)]">
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
                    className="mt-3 inline-flex min-h-11 items-center text-[var(--primary)] underline underline-offset-4"
                  >
                    Open published card
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-16" aria-labelledby="validate-heading">
        <h2 id="validate-heading" className="serif text-3xl">
          Place accuracy check
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Required: place, state, category, coordinates, and source. Duplicates and inconsistent
          slugs are rejected. Catalogue JSON stays read-only in this MVP; passing checks are audited.
        </p>
        <form
          action={validateCatalogueDraft}
          className="mt-6 grid gap-3 rounded-2xl bg-[var(--surface)] p-4 outline outline-1 outline-[var(--line)] sm:grid-cols-2"
        >
          <CsrfField />
          <label className="block text-sm sm:col-span-2">
            Title
            <input
              name="title"
              required
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            />
          </label>
          <label className="block text-sm">
            Slug
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            />
          </label>
          <label className="block text-sm">
            Category
            <select
              name="type"
              required
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            >
              <option value="">Select…</option>
              {(Object.keys(TYPE_LABEL) as HeritageType[]).map((k) => (
                <option key={k} value={k}>
                  {TYPE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            State / region
            <select
              name="region_slug"
              required
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            >
              <option value="">Select…</option>
              {regions.map((r) => (
                <option key={r.id} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Lat
              <input
                name="lat"
                type="number"
                step="any"
                className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
              />
            </label>
            <label className="block text-sm">
              Lng
              <input
                name="lng"
                type="number"
                step="any"
                className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
              />
            </label>
          </div>
          <label className="block text-sm sm:col-span-2">
            Summary
            <textarea
              name="summary"
              required
              rows={3}
              className="mt-1 w-full rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
            />
          </label>
          <label className="block text-sm">
            Source title
            <input
              name="sourceTitle"
              required
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            />
          </label>
          <label className="block text-sm">
            Source URL
            <input
              name="sourceUrl"
              type="url"
              required
              className="mt-1 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 outline outline-1 outline-[var(--line)]"
            />
          </label>
          <div className="sm:col-span-2">
            <button className="btn min-h-12 touch-manipulation select-none rounded-full bg-[var(--primary)] px-6 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]">
              Validate place draft
            </button>
          </div>
        </form>
      </section>

      <section className="mt-16" aria-labelledby="ask-log">
        <h2 id="ask-log" className="serif text-3xl">
          Ask log
        </h2>
        {asks.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No asks yet.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {asks.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
              >
                <span
                  className={`font-medium ${a.refused ? "text-[var(--muted)]" : "text-[var(--verified)]"}`}
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

      <section className="mt-16 mb-8" aria-labelledby="audit-log">
        <h2 id="audit-log" className="serif text-3xl">
          Audit log
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Staff actions on this device store. Path for reviewers: <code className="text-[var(--ink)]">{base}</code>
        </p>
        {audit.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No audit entries yet.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {audit.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
              >
                <span className="font-medium text-[var(--ink)]">{e.action}</span>
                <span className="text-[var(--muted)]"> · {e.actor} · {e.createdAt}</span>
                <p className="mt-1 text-[var(--ink-soft)]">{e.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

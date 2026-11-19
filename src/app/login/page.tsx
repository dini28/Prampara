import { clearLearner, saveLearner } from "@/app/login/actions";
import { PageShell } from "@/components/PageShell";
import { getLearnerName } from "@/lib/learner";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const learner = await getLearnerName();
  const sp = await searchParams;

  return (
    <PageShell
      width="narrow"
      crumbs={[{ href: "/", label: "Home" }, { label: "Profile" }]}
      eyebrow="Local profile"
      title="Name for this device"
      lead="No account required. This name labels quiz scores and contributions on this device only. Cards, Ask, and bookmarks work without it."
      nextHref="/me"
      nextLabel="See your path"
      secondaryHref="/explore"
      secondaryLabel="Keep browsing"
    >
      <section className="page-panel max-w-md p-5 sm:p-6" aria-labelledby="name-form">
        <h2 id="name-form" className="serif text-xl">
          Display name
        </h2>
        <form action={saveLearner} className="mt-4 space-y-4">
          <label className="block text-sm text-[var(--ink-soft)]" htmlFor="name">
            How should we label your activity?
            <input
              id="name"
              name="name"
              required
              minLength={2}
              defaultValue={learner ?? ""}
              className="mt-2 min-h-12 w-full rounded-xl bg-[var(--bg)] px-4 py-3 outline outline-1 outline-[var(--line)]"
              placeholder="e.g. Demo team"
            />
          </label>
          <button
            className="btn min-h-12 w-full rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
            type="submit"
          >
            Save on this device
          </button>
        </form>
        {learner ? (
          <form action={clearLearner} className="mt-4">
            <button className="min-h-11 text-sm text-[var(--primary)] underline underline-offset-4" type="submit">
              Clear local name
            </button>
          </form>
        ) : null}
        {sp.error ? (
          <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
            Use at least two characters.
          </p>
        ) : null}
      </section>
    </PageShell>
  );
}

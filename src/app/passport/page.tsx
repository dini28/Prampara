import { clearLearner, saveLearner } from "@/app/login/actions";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { CoverageMeter } from "@/components/CoverageMeter";
import { PageShell } from "@/components/PageShell";
import { PassportDashboard } from "@/components/PassportDashboard";
import { ProgressTransfer } from "@/components/ProgressTransfer";
import { getItemBySlug, getItems } from "@/lib/catalogue";
import { getCatalogueCoverage } from "@/lib/india-states";
import { getLearnerName } from "@/lib/learner";
import { listQuizzes } from "@/lib/runtime-store";

export const metadata = {
  title: "Passport · Parampara Path",
  description:
    "On-device passport: badges, themed trails, stamps, saved treasures, and a gentle streak.",
};

export default async function PassportPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const learner = await getLearnerName();
  const scores = listQuizzes(learner ?? "guest");
  const sp = await searchParams;
  const coverage = getCatalogueCoverage();
  const items = getItems();
  const treasureTitles: Record<string, string> = {};
  for (const item of items) treasureTitles[item.slug] = item.title;
  const catalogueSlugs = items.map((i) => i.slug);
  const discoverFallback = items[0]
    ? { slug: items[0].slug, title: items[0].title }
    : null;

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Passport" }]}
      eyebrow="On this device"
      title={learner ? `${learner}'s passport` : "Your passport"}
      lead="Badges, themed trails, stamps, and saved treasures stay on this device. No account required. Streaks stay gentle."
      nextHref="/map"
      nextLabel="Open the India map"
      secondaryHref="/places/rajasthan"
      secondaryLabel="Open a place hub"
    >
      <p className="mt-4 rounded-xl bg-[var(--saffron-tint)] px-4 py-3 text-sm text-[var(--saffron-ink)]">
        Data note: progress, bookmarks, and quiz scores stay on this device. Clear site data removes
        them. Contributions stay unpublished until a human reviewer accepts them.
      </p>

      <div className="mt-8 max-w-xl">
        <CoverageMeter catalogueCovered={coverage.coveredCount} />
      </div>

      <div className="mt-10">
        <PassportDashboard
          treasureTitles={treasureTitles}
          catalogueSlugs={catalogueSlugs}
          discoverFallback={discoverFallback}
        />
      </div>

      <section className="mt-12 page-panel max-w-lg p-5 sm:p-6" aria-labelledby="name-form">
        <h2 id="name-form" className="serif text-xl">
          Display name
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Optional. Labels quiz scores on this device only.
        </p>
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
            <button
              className="min-h-11 text-sm text-[var(--primary)] underline underline-offset-4"
              type="submit"
            >
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

      <ProgressTransfer />

      <section className="mt-12" aria-labelledby="saved-list">
        <h2 id="saved-list" className="serif text-2xl">
          Saved treasures
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Bookmarks you pin on cards stay on this phone or laptop.
        </p>
        <div className="mt-6">
          <BookmarkGrid />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="quiz-stamps">
        <h2 id="quiz-stamps" className="serif text-2xl">
          Quiz scores
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Scores stored with your local name. On-device quiz stamps also count toward badges.
        </p>
        {scores.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            No quiz scores yet , finish a card quiz to earn one.
          </p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
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
    </PageShell>
  );
}

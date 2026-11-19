import { AskBox } from "@/components/AskBox";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { getItemBySlug } from "@/lib/catalogue";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AskPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  return (
    <PageShell
      width="narrow"
      before={
        <>
          <LoopStepper current="ask" itemSlug={slug} />
          <div className="mt-4">
            <UserNeedBanner ids={["UR-04", "UR-05"]} />
          </div>
        </>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Ask" },
      ]}
      eyebrow="Step 3 · Grounded Q&A"
      title="Ask from the card"
      lead="Answers come only from this card and its sources. If something isn’t covered, the app refuses instead of inventing."
      nextHref={`/items/${slug}/quiz`}
      nextLabel="Next: Quiz"
      secondaryHref={`/items/${slug}`}
      secondaryLabel="Back to card"
    >
      <div className="page-panel p-4 sm:p-6">
        <AskBox slug={slug} />
      </div>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Try a refuse probe such as “exact visarjan minute tomorrow?” — the app should say it is not
        covered.{" "}
        <Link href={`/items/${slug}`} className="text-[var(--primary)] underline underline-offset-4">
          Re-read {item.title}
        </Link>
      </p>
    </PageShell>
  );
}

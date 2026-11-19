import { AskBox } from "@/components/AskBox";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
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
        <div className="sticky-mini-header -mx-5 px-5 py-3 md:static md:mx-0 md:bg-transparent md:p-0">
          <LoopStepper current="ask" itemSlug={slug} />
        </div>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Ask" },
      ]}
      eyebrow="Ask · answers only from the card"
      title="Ask from the card"
      lead="Answers come only from this card and its sources. If something is not covered, the app refuses instead of inventing."
      nextHref={`/items/${slug}/quiz`}
      nextLabel="Next: Take the quiz"
      secondaryHref={`/items/${slug}`}
      secondaryLabel="Back to card"
    >
      <AskBox slug={slug} />
      <p className="mt-6 text-sm text-[var(--muted)]">
        Try a refuse probe such as “exact visarjan minute tomorrow?” The app should say it is not
        covered.{" "}
        <Link href={`/items/${slug}`} className="text-[var(--primary)] underline underline-offset-4">
          Re-read {item.title}
        </Link>
      </p>
    </PageShell>
  );
}

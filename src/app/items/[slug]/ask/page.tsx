import { AskBox } from "@/components/AskBox";
import { LoopStepper } from "@/components/LoopStepper";
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
    <main className="mx-auto max-w-3xl px-5 py-10">
      <LoopStepper current="ask" itemSlug={slug} />
      <div className="mt-6">
        <UserNeedBanner ids={["UR-04", "UR-05"]} />
      </div>
      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        <Link href={`/items/${slug}`} className="underline underline-offset-4 hover:text-[var(--ink)]">
          {item.title}
        </Link>
        {" · "}Step 3 · AI is a retrieval interface, not an author of culture
      </p>
      <h1 className="serif mt-3 text-4xl">Ask from the card</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        Prove grounding: ask something the card covers, then a refuse probe such as “exact visarjan
        minute tomorrow?” — the app must say it is not covered rather than invent a time.
      </p>
      <div className="mt-8">
        <AskBox slug={slug} />
      </div>
      <nav className="mt-10 flex flex-wrap gap-3" aria-label="Continue learner loop">
        <Link
          href={`/items/${slug}/quiz`}
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Next: Quiz
        </Link>
        <Link
          href={`/items/${slug}`}
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Back to card
        </Link>
      </nav>
    </main>
  );
}

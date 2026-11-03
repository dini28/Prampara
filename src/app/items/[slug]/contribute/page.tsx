import { ContributeForm } from "@/components/ContributeForm";
import { LoopStepper } from "@/components/LoopStepper";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { getItemBySlug } from "@/lib/catalogue";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ContributePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <LoopStepper current="contribute" itemSlug={slug} />
      <div className="mt-6">
        <UserNeedBanner ids={["UR-07", "UR-09"]} />
      </div>
      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        <Link href={`/items/${slug}`} className="underline underline-offset-4 hover:text-[var(--ink)]">
          {item.title}
        </Link>
        {" · "}Step 5 · Unpublished until a human accepts
      </p>
      <h1 className="serif mt-3 text-4xl">Contribute a note</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        Learner or family notes close the loop without polluting the catalogue. After you queue a
        note, open Admin and accept or reject it — that gate is part of the project requirement.
      </p>
      <div className="mt-8 rounded-2xl bg-[var(--bg)] p-6 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)]">
        <ContributeForm slug={slug} />
      </div>
      <nav className="mt-10 flex flex-wrap gap-3" aria-label="Continue learner loop">
        <Link
          href="/admin"
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Open reviewer queue
        </Link>
        <Link
          href="/me"
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          View Path
        </Link>
      </nav>
    </main>
  );
}

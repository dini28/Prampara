import { LoopStepper } from "@/components/LoopStepper";
import { QuizForm } from "@/components/QuizForm";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { getItemBySlug } from "@/lib/catalogue";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <LoopStepper current="quiz" itemSlug={slug} />
      <div className="mt-6">
        <UserNeedBanner ids={["UR-06"]} />
      </div>
      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        <Link href={`/items/${slug}`} className="underline underline-offset-4 hover:text-[var(--ink)]">
          {item.title}
        </Link>
        {" · "}Step 4 · Learning check from this card only
      </p>
      <h1 className="serif mt-3 text-4xl">{item.quiz.title}</h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Questions are written from this card’s text — not from an open web model. Scores appear on
        your Path for the demo walkthrough.
      </p>
      <div className="mt-8">
        <QuizForm quiz={item.quiz} itemSlug={slug} />
      </div>
      <nav className="mt-10 flex flex-wrap gap-3" aria-label="Continue learner loop">
        <Link
          href={`/items/${slug}/contribute`}
          className="btn inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
        >
          Next: Contribute
        </Link>
        <Link
          href={`/items/${slug}/ask`}
          className="btn inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
        >
          Back to Ask
        </Link>
      </nav>
    </main>
  );
}

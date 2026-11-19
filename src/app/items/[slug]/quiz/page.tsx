import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { QuizForm } from "@/components/QuizForm";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { getItemBySlug } from "@/lib/catalogue";
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
    <PageShell
      width="narrow"
      before={
        <>
          <LoopStepper current="quiz" itemSlug={slug} />
          <div className="mt-4">
            <UserNeedBanner ids={["UR-06"]} />
          </div>
        </>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Quiz" },
      ]}
      eyebrow="Step 4 · Learning check"
      title={item.quiz.title}
      lead="Questions are written from this card’s text — not from an open web model. Scores appear on your Path."
      nextHref={`/items/${slug}/contribute`}
      nextLabel="Next: Contribute"
      secondaryHref={`/items/${slug}/ask`}
      secondaryLabel="Back to Ask"
    >
      <div className="page-panel p-4 sm:p-6">
        <QuizForm quiz={item.quiz} itemSlug={slug} />
      </div>
    </PageShell>
  );
}

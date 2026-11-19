import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { QuizForm } from "@/components/QuizForm";
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
        <div className="sticky-mini-header -mx-5 px-5 py-3 md:static md:mx-0 md:bg-transparent md:p-0">
          <LoopStepper current="quiz" itemSlug={slug} />
        </div>
      }
      crumbs={[
        { href: "/", label: "Home" },
        { href: `/items/${slug}`, label: item.title },
        { label: "Quiz" },
      ]}
      eyebrow="Quiz · check recall"
      title={item.quiz.title}
      lead="Questions are written from this card’s text, not from an open web model. Scores stay on this device with your profile name."
      nextHref={`/items/${slug}/contribute`}
      nextLabel="Finish: Share a note"
      secondaryHref={`/items/${slug}/ask`}
      secondaryLabel="Back to Ask"
    >
      <div className="page-panel p-4 sm:p-6">
        <QuizForm quiz={item.quiz} itemSlug={slug} />
      </div>
    </PageShell>
  );
}

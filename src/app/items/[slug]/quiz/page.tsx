import { QuizForm } from "@/components/QuizForm";
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
      <Link href={`/items/${slug}`} className="text-sm underline">
        Back to card
      </Link>
      <h1 className="serif mt-4 text-4xl">{item.quiz.title}</h1>
      <p className="mt-3 text-[var(--ink-soft)]">Questions are written from this card only.</p>
      <div className="mt-8">
        <QuizForm quiz={item.quiz} itemSlug={slug} />
      </div>
    </main>
  );
}

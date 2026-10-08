import { AskBox } from "@/components/AskBox";
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
      <Link href={`/items/${slug}`} className="text-sm underline">
        Back to card
      </Link>
      <h1 className="serif mt-4 text-4xl">Ask · {item.title}</h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Try a refuse probe: “exact visarjan minute tomorrow?” or a grounded one: “what is this app’s
        stance on hotel shows?”
      </p>
      <div className="mt-8">
        <AskBox slug={slug} />
      </div>
    </main>
  );
}

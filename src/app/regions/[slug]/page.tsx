import { ItemCard } from "@/components/ItemCard";
import { LoopStepper } from "@/components/LoopStepper";
import { getItems, getRegionBySlug } from "@/lib/catalogue";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();
  const items = getItems().filter((i) => i.region_slug === slug);
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <LoopStepper current="discover" />
      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        <Link href="/explore" className="underline underline-offset-4 hover:text-[var(--ink)]">
          Explore
        </Link>
        {" · "}Place entry · {region.zone}
      </p>
      <h1 className="serif mt-2 text-5xl">{region.name}</h1>
      <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">{region.blurb}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Open a card to continue the loop: sources → Ask → Quiz → Contribute.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} region={region} />
        ))}
      </div>
    </main>
  );
}

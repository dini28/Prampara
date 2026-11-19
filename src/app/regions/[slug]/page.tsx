import { ItemCard } from "@/components/ItemCard";
import { LoopStepper } from "@/components/LoopStepper";
import { PageShell } from "@/components/PageShell";
import { getItems, getRegionBySlug } from "@/lib/catalogue";
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
    <PageShell
      width="wide"
      before={<LoopStepper current="discover" />}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { label: region.name },
      ]}
      eyebrow={region.zone ? `${region.zone} · place entry` : "Place entry"}
      title={region.name}
      lead={`${region.blurb} Open a card to continue the loop: sources → Ask → Quiz → Contribute.`}
      nextHref={`/explore?region=${region.slug}`}
      nextLabel="Filter Explore to this place"
      secondaryHref="/map"
      secondaryLabel="See on map"
    >
      <section aria-labelledby="region-cards">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 id="region-cards" className="serif text-2xl">
            Cards in {region.name}
          </h2>
          <p className="text-sm text-[var(--muted)] tabular-nums">
            {items.length} {items.length === 1 ? "card" : "cards"}
          </p>
        </div>
        {items.length === 0 ? (
          <div className="page-panel p-6 text-sm text-[var(--ink-soft)]">
            No published cards for this place yet. Browse Explore for other regions.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} region={region} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

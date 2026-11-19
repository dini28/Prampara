import { CoverageMeter } from "@/components/CoverageMeter";
import { MapExperience } from "@/components/MapExperience";
import type { MapPlace } from "@/components/HeritageMap";
import type { BoardTreasure } from "@/components/IndiaGameBoard";
import { PageShell } from "@/components/PageShell";
import { getItems, getRegionBySlug } from "@/lib/catalogue";
import { getCatalogueCoverage, regionSlugToStateSlug } from "@/lib/india-states";
import { enrichPlace } from "@/lib/place-enrichment";

export const metadata = {
  title: "Map , Parampara Path",
  description:
    "India game board with state progress, plus nearby living heritage and cited cards.",
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const coverage = getCatalogueCoverage();

  const treasuresByState: Record<string, BoardTreasure[]> = {};
  for (const item of getItems()) {
    const stateSlug = regionSlugToStateSlug(item.region_slug);
    if (!stateSlug) continue;
    if (!treasuresByState[stateSlug]) treasuresByState[stateSlug] = [];
    treasuresByState[stateSlug].push({
      slug: item.slug,
      title: item.title,
      type: item.type,
      regionSlug: item.region_slug,
    });
  }

  const places: MapPlace[] = [];
  for (const item of getItems()) {
    const region = getRegionBySlug(item.region_slug);
    if (region?.lat == null || region?.lng == null) continue;
    const enrichment = enrichPlace(item, region);
    places.push({
      slug: item.slug,
      title: item.title,
      type: item.type,
      regionName: region.name,
      regionSlug: region.slug,
      lat: region.lat,
      lng: region.lng,
      summary: item.summary,
      lesserKnown: enrichment.lesserKnown,
      bestSeason: enrichment.bestSeason,
      howToReach: enrichment.howToReach,
      respectfulTips: enrichment.respectfulTips,
      story: enrichment.story,
    });
  }

  const initialState =
    sp.region && regionSlugToStateSlug(sp.region)
      ? regionSlugToStateSlug(sp.region)
      : null;

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Map" }]}
      eyebrow="India game board"
      title="Map your progress"
      lead="Fill states as you unlock cited treasures. Grey means cards are not published yet , we do not invent them. Nearby map stays available below for location-aware discovery."
      nextHref="/places/rajasthan"
      nextLabel="Open Rajasthan hub"
      secondaryHref="/passport"
      secondaryLabel="Passport"
    >
      <div className="mb-8 max-w-xl">
        <CoverageMeter catalogueCovered={coverage.coveredCount} compact />
      </div>

      <MapExperience
        coveredSlugs={[...coverage.coveredSlugs]}
        cardCountByState={coverage.cardCountByState}
        treasuresByState={treasuresByState}
        initialStateSlug={initialState}
        places={places}
      />
    </PageShell>
  );
}

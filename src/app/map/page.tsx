import { HeritageMap, type MapPlace } from "@/components/HeritageMap";
import { PageShell } from "@/components/PageShell";
import { getItems, getRegionBySlug } from "@/lib/catalogue";
import { enrichPlace } from "@/lib/place-enrichment";

export const metadata = {
  title: "Map — Parampara Path",
  description: "Nearby living heritage across India — villages, crafts, festivals, and cited cards.",
};

export default function MapPage() {
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

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Map" }]}
      eyebrow="Location-aware discovery"
      title="Map & nearby heritage"
      lead="Allow location (kept on your device) or pick a state. Teal markers highlight lesser-known practices — not only famous cities."
      nextHref="/explore"
      nextLabel="Explore as a list"
      secondaryHref="/bookmarks"
      secondaryLabel="Open saved cards"
    >
      <HeritageMap places={places} />
    </PageShell>
  );
}

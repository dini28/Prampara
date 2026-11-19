import { HomeLocale } from "@/components/HomeLocale";
import { HomeShell } from "@/components/HomeShell";
import { OnboardingSlides } from "@/components/OnboardingSlides";
import { getItemBySlug, getRegionBySlug } from "@/lib/catalogue";
import { getCatalogueCoverage } from "@/lib/india-states";

export default function HomePage() {
  const coverage = getCatalogueCoverage();
  const featuredSlugs = [
    "kalbelia",
    "theyyam",
    "durga-puja-kolkata",
    "thathera-jandiala-guru",
  ] as const;
  const featured = featuredSlugs
    .map((slug) => {
      const item = getItemBySlug(slug);
      if (!item) return null;
      return { item, region: getRegionBySlug(item.region_slug) };
    })
    .filter(Boolean) as { item: NonNullable<ReturnType<typeof getItemBySlug>>; region: ReturnType<typeof getRegionBySlug> }[];

  return (
    <HomeShell>
      <OnboardingSlides />
      <main id="main-content">
        <HomeLocale catalogueCovered={coverage.coveredCount} featured={featured} />
      </main>
    </HomeShell>
  );
}

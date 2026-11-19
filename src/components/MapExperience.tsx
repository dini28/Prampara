"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";
import type { BoardTreasure } from "@/components/IndiaGameBoard";
import type { MapPlace } from "@/components/HeritageMap";

const IndiaGameBoard = dynamic(
  () => import("@/components/IndiaGameBoard").then((m) => m.IndiaGameBoard),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid min-h-[280px] place-items-center rounded-2xl bg-[var(--surface)] text-sm text-[var(--muted)] outline outline-1 outline-[var(--line)]"
        role="status"
      >
        Loading India map…
      </div>
    ),
  },
);

const HeritageMap = dynamic(
  () => import("@/components/HeritageMap").then((m) => m.HeritageMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid min-h-[240px] place-items-center rounded-2xl bg-[var(--surface)] text-sm text-[var(--muted)] outline outline-1 outline-[var(--line)]"
        role="status"
      >
        Loading nearby map…
      </div>
    ),
  },
);

type Props = {
  coveredSlugs: string[];
  cardCountByState: Record<string, number>;
  treasuresByState: Record<string, BoardTreasure[]>;
  initialStateSlug?: string | null;
  places: MapPlace[];
};

export function MapExperience({
  coveredSlugs,
  cardCountByState,
  treasuresByState,
  initialStateSlug,
  places,
}: Props) {
  const [lang] = useLang();

  return (
    <>
      <IndiaGameBoard
        coveredSlugs={coveredSlugs}
        cardCountByState={cardCountByState}
        treasuresByState={treasuresByState}
        initialStateSlug={initialStateSlug}
      />

      <section className="mt-16 border-t border-[var(--line)] pt-12" aria-labelledby="nearby-map">
        <h2 id="nearby-map" className="serif text-3xl">
          {t(lang, "nearbyTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">{t(lang, "nearbyLead")}</p>
        <div className="mt-6">
          <HeritageMap places={places} />
        </div>
      </section>
    </>
  );
}

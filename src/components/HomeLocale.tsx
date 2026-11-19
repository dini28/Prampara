"use client";

import Image from "next/image";
import Link from "next/link";
import { CoverageMeter } from "@/components/CoverageMeter";
import { ItemCard } from "@/components/ItemCard";
import { useLang } from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";
import { HERO_IMAGE } from "@/lib/home-visuals";
import type { HeritageItem, Region } from "@/lib/types";

type Featured = { item: HeritageItem; region: Region | undefined };

export function HomeLocale({
  catalogueCovered,
  featured,
}: {
  catalogueCovered: number;
  featured: Featured[];
}) {
  const [lang] = useLang();

  const how = [
    { step: "1", title: t(lang, "how1"), body: t(lang, "how1body"), href: "/map" },
    { step: "2", title: t(lang, "how2"), body: t(lang, "how2body"), href: "/items/kalbelia" },
    { step: "3", title: t(lang, "how3"), body: t(lang, "how3body"), href: "/passport" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_275/0.92)] via-[oklch(0.28_0.06_40/0.55)] to-[oklch(0.22_0.05_275/0.2)]"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium tracking-[0.16em] text-white/80 uppercase">
              Parampara Path
            </p>
            <span className="unofficial-chip bg-white/15 text-white outline-white/30">
              {t(lang, "unofficial")}
            </span>
          </div>
          <h1 className="serif mt-4 max-w-[16ch] text-5xl leading-[1.02] text-white md:text-6xl lg:text-7xl">
            {t(lang, "heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            {t(lang, "heroPurpose")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="btn inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[var(--primary-deep)] hover:bg-white/90"
            >
              {t(lang, "ctaMap")}
            </Link>
            <Link
              href="/places/rajasthan"
              className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
            >
              {t(lang, "ctaPlace")}
            </Link>
            <Link
              href="/items/kalbelia"
              className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-transparent px-6 text-white/95 hover:bg-white/10"
            >
              {t(lang, "ctaDemo")}
            </Link>
          </div>
          <p className="mt-6 text-[10px] tracking-wide text-white/55">{HERO_IMAGE.credit}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <CoverageMeter catalogueCovered={catalogueCovered} />

        <section className="mt-12" aria-labelledby="how-works">
          <h2 id="how-works" className="serif text-3xl">
            {t(lang, "howTitle")}
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {how.map((h) => (
              <li key={h.step}>
                <Link
                  href={h.href}
                  className="page-panel flex h-full flex-col p-5 hover:outline-[var(--primary)]"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-[var(--saffron-tint)] text-sm font-bold text-[var(--saffron-ink)]">
                    {h.step}
                  </span>
                  <span className="serif mt-3 text-xl">{h.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {h.body}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14" aria-labelledby="featured">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="featured" className="serif text-3xl">
                {t(lang, "featuredTitle")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--ink-soft)]">{t(lang, "featuredLead")}</p>
            </div>
            <Link
              href="/map"
              className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
            >
              {t(lang, "browseByState")}
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {featured.map(({ item, region }) => (
              <ItemCard key={item.id} item={item} region={region} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

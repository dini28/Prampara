"use client";

import Image from "next/image";
import Link from "next/link";
import { CoverageMeter } from "@/components/CoverageMeter";
import { HiddenGems } from "@/components/HiddenGems";
import { ItemCard } from "@/components/ItemCard";
import { useLang } from "@/components/LanguageToggle";
import { PassportStamps } from "@/components/PassportStamps";
import { PhotoUnderstand } from "@/components/PhotoUnderstand";
import { WhereAreYou } from "@/components/WhereAreYou";
import type { HiddenGem } from "@/lib/hidden-gems";
import { HERO_IMAGE } from "@/lib/home-visuals";
import { t } from "@/lib/i18n";
import type { HeritageItem, Region } from "@/lib/types";

type Featured = { item: HeritageItem; region: Region | undefined };

export function HomeLocale({
  catalogueCovered,
  featured,
  gems,
}: {
  catalogueCovered: number;
  featured: Featured[];
  gems: HiddenGem[];
}) {
  const [lang] = useLang();

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
            className="object-cover object-[center_35%]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_275/0.93)] via-[oklch(0.28_0.06_40/0.62)] to-[oklch(0.22_0.05_275/0.35)]"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto flex min-h-[min(88dvh,720px)] max-w-6xl flex-col justify-end px-5 pb-12 pt-16 md:justify-center md:pb-20 md:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium tracking-[0.16em] text-white/80 uppercase">
              Parampara Path
            </p>
            <span className="unofficial-chip bg-white/15 text-white outline-white/30">
              {t(lang, "unofficial")}
            </span>
          </div>
          <h1 className="serif mt-4 max-w-[15ch] text-5xl leading-[1.02] text-white md:text-6xl lg:text-7xl">
            {t(lang, "heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            {t(lang, "heroPurpose")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#camera-look"
              className="btn inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[var(--primary-deep)] hover:bg-white/90"
            >
              {t(lang, "ctaPhoto")}
            </a>
            <Link
              href="/map"
              className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
            >
              {t(lang, "ctaMap")}
            </Link>
            <Link
              href="#hidden-gems"
              className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-transparent px-6 text-white/95 hover:bg-white/10"
            >
              Hidden gems
            </Link>
          </div>
          <p className="mt-6 max-w-lg text-sm text-white/70">{t(lang, "heroFor")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pb-14">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <WhereAreYou compact />
          <CoverageMeter catalogueCovered={catalogueCovered} />
        </div>

        <section id="camera-look" className="mt-12 scroll-mt-24" aria-label="Camera look">
          <div className="mb-5 max-w-2xl">
            <h2 className="serif text-3xl sm:text-4xl">{t(lang, "cameraTitle")}</h2>
            <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
              {t(lang, "cameraLead")}
            </p>
          </div>
          <PhotoUnderstand />
        </section>

        <div className="mt-16">
          <HiddenGems gems={gems} />
        </div>

        <section className="mt-16" aria-labelledby="journey">
          <h2 id="journey" className="serif text-3xl">
            {t(lang, "howTitle")}
          </h2>
          <ol className="mt-6 divide-y divide-[var(--line)] overflow-hidden rounded-2xl bg-[var(--surface)] outline outline-1 outline-[var(--line)]">
            {[
              { step: "01", title: t(lang, "how1"), body: t(lang, "how1body"), href: "/map" },
              {
                step: "02",
                title: t(lang, "how2"),
                body: t(lang, "how2body"),
                href: "/items/kalbelia",
              },
              {
                step: "03",
                title: t(lang, "how3"),
                body: t(lang, "how3body"),
                href: "/passport",
              },
            ].map((h) => (
              <li key={h.step}>
                <Link
                  href={h.href}
                  className="flex flex-col gap-2 px-5 py-5 transition-colors hover:bg-[var(--bg)] sm:flex-row sm:items-center sm:gap-6 sm:px-6"
                >
                  <span className="serif text-2xl tabular-nums text-[var(--saffron-ink)] sm:w-14">
                    {h.step}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="serif block text-xl text-[var(--ink)]">{h.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--ink-soft)]">
                      {h.body}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-[var(--primary)] sm:shrink-0">
                    Open
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16">
          <PassportStamps teaser />
        </div>

        <section className="mt-16" aria-labelledby="featured">
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

import Image from "next/image";
import Link from "next/link";
import { HomeShell } from "@/components/HomeShell";
import { ItemCard } from "@/components/ItemCard";
import { getDisclaimer, getItemBySlug, getRegionBySlug } from "@/lib/catalogue";
import {
  GALLERY_STRIP,
  HERO_IMAGE,
  REGION_VISUALS,
  VISUAL_CATEGORIES,
} from "@/lib/home-visuals";
import { LEARNER_LOOP } from "@/lib/project";

const safeguards = [
  {
    title: "Every card cites its sources",
    body: "UNESCO, Ministry of Culture, and open scholarship, with the date each was checked.",
  },
  {
    title: "Answers come only from the cards",
    body: "If the cards don't support an answer, Ask says so instead of guessing.",
  },
  {
    title: "A person reviews every contribution",
    body: "Stories you submit stay hidden until a reviewer accepts them.",
  },
];

export default function HomePage() {
  const kalbelia = getItemBySlug("kalbelia");
  const durga = getItemBySlug("durga-puja-kolkata");
  const thathera = getItemBySlug("thathera-jandiala-guru");
  const theyyam = getItemBySlug("theyyam");
  const featured = [kalbelia, theyyam, durga, thathera].filter(Boolean);

  return (
    <HomeShell>
      <main>
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
              className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.03_255/0.88)] via-[oklch(0.16_0.03_255/0.55)] to-[oklch(0.16_0.03_255/0.25)]"
              aria-hidden="true"
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
            <p className="text-sm font-medium tracking-[0.16em] text-white/80 uppercase">
              Parampara Path
            </p>
            <h1 className="serif mt-4 max-w-[16ch] text-5xl leading-[1.02] text-white md:text-6xl lg:text-7xl">
              Living Heritage Compass
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Explore India&apos;s living culture through place, craft, festival, and voice —
              cited cards first, then a short learner loop that refuses to invent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="btn inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[var(--primary-deep)] hover:bg-white/90"
              >
                Explore the map of practices
              </Link>
              <Link
                href="/items/kalbelia"
                className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Demo: Kalbelia loop
              </Link>
            </div>
            <p className="mt-6 text-[10px] tracking-wide text-white/55">{HERO_IMAGE.credit}</p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-6">
          <p className="rounded-xl bg-[var(--bg)]/90 px-4 py-3 text-sm leading-relaxed text-[var(--ink-soft)] outline outline-1 outline-[var(--line)]">
            {getDisclaimer()}
          </p>
        </div>

        <section className="border-b border-[var(--line)] py-4" aria-label="Visual themes">
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {GALLERY_STRIP.map((shot) => (
              <figure
                key={shot.src}
                className="relative h-36 w-56 shrink-0 overflow-hidden rounded-xl outline outline-1 outline-[var(--line)]"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-medium text-white">
                  {shot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-14">
          <section aria-labelledby="categories">
            <div className="max-w-2xl">
              <h2 id="categories" className="serif text-3xl md:text-4xl">
                See the culture, then open a card
              </h2>
              <p className="mt-3 text-[var(--ink-soft)]">
                Six living-heritage lenses — festivals, performance, craft, oral traditions,
                ritual, and knowledge — including regional practices that rarely make tourist lists.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VISUAL_CATEGORIES.map((cat) => (
                <Link key={cat.type} href={cat.href} className="visual-card group block aspect-[4/5]">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="visual-card-overlay absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-medium tracking-wide text-white/70 uppercase">
                      {cat.type}
                    </p>
                    <h3 className="serif mt-1 text-2xl">{cat.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{cat.blurb}</p>
                    <p className="mt-3 text-[10px] text-white/50">{cat.credit}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="regions">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 id="regions" className="serif text-3xl md:text-4xl">
                  Across regions — not only the famous few
                </h2>
                <p className="mt-3 text-[var(--ink-soft)]">
                  Desert, coast, Deccan, Himalaya, and the North-East share the frame. Images set
                  place; cards carry the cited practices.
                </p>
              </div>
              <Link
                href="/explore"
                className="min-h-11 content-center text-sm text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
              >
                Browse by place
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {REGION_VISUALS.map((region) => (
                <Link key={region.title} href={region.href} className="visual-card group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={region.image}
                      alt={region.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium tracking-wide text-[var(--primary)] uppercase">
                      {region.place}
                    </p>
                    <h3 className="serif mt-1 text-xl">{region.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {region.blurb}
                    </p>
                    <p className="mt-2 text-[10px] text-[var(--muted)]">{region.credit}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="loop">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="loop" className="serif text-3xl">
                  The learner loop
                </h2>
                <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
                  One job per step — place or theme, cited card, grounded Ask, quiz, then a
                  contribution that stays unpublished until a human accepts it.
                </p>
              </div>
              <Link
                href="/about#requirements"
                className="min-h-11 content-center text-sm text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
              >
                Analyse UR-01…UR-12
              </Link>
            </div>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {LEARNER_LOOP.map((step) => (
                <li key={step.id}>
                  <Link
                    href={step.href}
                    className="group flex h-full flex-col rounded-2xl bg-[var(--bg)] p-4 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] transition-[outline-color] duration-200 hover:outline-[var(--primary)]"
                  >
                    <span className="text-xs font-semibold tabular-nums text-[var(--primary)]">
                      Step {step.step}
                    </span>
                    <span className="serif mt-2 text-xl group-hover:text-[var(--primary)]">
                      {step.title}
                    </span>
                    <span className="mt-1 text-xs font-medium text-[var(--muted)]">{step.short}</span>
                    <span className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {step.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="serif text-3xl">Start with a cited card</h2>
              <p className="mt-2 text-[var(--ink-soft)]">
                Lesser-known and better-known practices sit side by side — each with sources before
                Ask or Quiz.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {featured.map((item) =>
                  item ? (
                    <ItemCard
                      key={item.id}
                      item={item}
                      region={getRegionBySlug(item.region_slug)}
                    />
                  ) : null,
                )}
              </div>
            </div>
            <section
              aria-labelledby="reliability"
              className="rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] lg:sticky lg:top-24"
            >
              <h2 id="reliability" className="serif text-2xl">
                How we keep it reliable
              </h2>
              <ul className="mt-5 space-y-4">
                {safeguards.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <span
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--verified-tint)] text-[var(--verified)]"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium text-[var(--ink)]">{s.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/explore"
                className="btn mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
              >
                Open all 40 cards
              </Link>
            </section>
          </section>
        </div>
      </main>
    </HomeShell>
  );
}

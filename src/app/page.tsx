import Image from "next/image";
import Link from "next/link";
import { HomeShell } from "@/components/HomeShell";
import { InfoTip } from "@/components/InfoTip";
import { ItemCard } from "@/components/ItemCard";
import { OnboardingSlides } from "@/components/OnboardingSlides";
import { PhotoUnderstand } from "@/components/PhotoUnderstand";
import { WhereAreYou } from "@/components/WhereAreYou";
import { getItemBySlug, getRegionBySlug } from "@/lib/catalogue";
import { getDestinations } from "@/lib/destinations";
import { HERO_IMAGE } from "@/lib/home-visuals";
import { LEARNER_LOOP } from "@/lib/project";

const PURPOSE =
  "Visit any place in India and understand it deeply: the culture of the whole state, the heritage of your city, the meaning behind what you see, the best food and travel, and the modern India growing beside it.";

const HOW = [
  {
    step: "1",
    title: "Choose a place",
    body: "Allow approximate location or search a city or state.",
    href: "/places",
  },
  {
    step: "2",
    title: "Read the layers",
    body: "State story, city heritage route, food, travel, then modern India.",
    href: "/places/udaipur",
  },
  {
    step: "3",
    title: "Learn in 8 minutes",
    body: "Open a cited card, Ask, Quiz, and optionally Contribute.",
    href: "/items/kalbelia",
  },
];

export default function HomePage() {
  const kalbelia = getItemBySlug("kalbelia");
  const durga = getItemBySlug("durga-puja-kolkata");
  const thathera = getItemBySlug("thathera-jandiala-guru");
  const theyyam = getItemBySlug("theyyam");
  const featured = [kalbelia, theyyam, durga, thathera].filter(Boolean);
  const pilotCities = getDestinations().filter((d) => d.kind === "city");

  return (
    <HomeShell>
      <OnboardingSlides />
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
              className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_275/0.9)] via-[oklch(0.28_0.06_40/0.55)] to-[oklch(0.22_0.05_275/0.25)]"
              aria-hidden="true"
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium tracking-[0.16em] text-white/80 uppercase">
                Parampara Path
              </p>
              <span className="unofficial-chip bg-white/15 text-white outline-white/30">
                Unofficial
              </span>
            </div>
            <h1 className="serif mt-4 max-w-[18ch] text-5xl leading-[1.02] text-white md:text-6xl lg:text-7xl">
              Living Heritage Compass
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">{PURPOSE}</p>
            <p className="mt-3 max-w-xl text-sm text-white/75">
              For students and curious travellers. Cited cards first. Ask answers only from the card.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/places"
                className="btn inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[var(--primary-deep)] hover:bg-white/90"
              >
                Where are you?
              </Link>
              <Link
                href="/map"
                className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Explore the map of practices
              </Link>
              <Link
                href="/items/kalbelia"
                className="btn inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Try the 8 minute demo
              </Link>
            </div>
            <p className="mt-6 text-[10px] tracking-wide text-white/55">{HERO_IMAGE.credit}</p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-10">
          <section aria-labelledby="how-works">
            <h2 id="how-works" className="serif text-3xl">
              How it works
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {HOW.map((h) => (
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

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <WhereAreYou />
            <PhotoUnderstand destinationSlug="udaipur" compact />
          </div>

          <section className="mt-14" aria-labelledby="pilot">
            <h2 id="pilot" className="serif text-3xl">
              Pilot places
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
              Rajasthan and Udaipur are built end to end. Jaipur, Jodhpur, and Jaisalmer share the same
              data shape so new cities load from files without code changes.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pilotCities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/places/${c.slug}`} className="visual-card group block">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={c.hero_image.src}
                        alt={c.hero_image.alt}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="visual-card-overlay absolute inset-0" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-xs uppercase tracking-wide text-white/70">{c.state_ut}</p>
                        <h3 className="serif text-xl">{c.name}</h3>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="jargon">
            <h2 id="jargon" className="serif text-2xl">
              Plain language
            </h2>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              <li className="page-panel px-4 py-3">
                <InfoTip label="UNESCO Intangible Cultural Heritage">
                  Living practices recognised on UNESCO lists for intangible cultural heritage, not
                  only monuments.
                </InfoTip>
              </li>
              <li className="page-panel px-4 py-3">
                <InfoTip label="Geographical Indication (protected craft name)">
                  A GI tag is a protected name for a craft or product tied to a place, under Indian
                  intellectual property law.
                </InfoTip>
              </li>
              <li className="page-panel px-4 py-3">
                <InfoTip label="Ask (answers only from the card)">
                  Formerly called Grounded Ask. The answer must come from the cited card text and
                  sources, or the app refuses.
                </InfoTip>
              </li>
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="loop">
            <h2 id="loop" className="serif text-3xl">
              The 8 minute learning loop
            </h2>
            <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
              Still the heart of the product, now inside a place first journey.
            </p>
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

          <section className="mt-14">
            <h2 className="serif text-3xl">Start with a cited card</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {featured.map((item) =>
                item ? (
                  <ItemCard key={item.id} item={item} region={getRegionBySlug(item.region_slug)} />
                ) : null,
              )}
            </div>
          </section>
        </div>
      </main>
    </HomeShell>
  );
}

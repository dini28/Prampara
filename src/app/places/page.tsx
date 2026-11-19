import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { WhereAreYou } from "@/components/WhereAreYou";
import { getChildCities, getDestinations } from "@/lib/destinations";

export const metadata = {
  title: "Places · Parampara Path",
  description:
    "Visit any place in India and understand it deeply: state culture, city heritage, food, travel, and modern India beside it.",
};

export default function PlacesIndexPage() {
  const states = getDestinations().filter((d) => d.kind === "state");
  const cities = getDestinations().filter((d) => d.kind === "city");

  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Places" }]}
      eyebrow="Place first journey"
      title="Where do you want to understand?"
      lead="Start with a state story, then open a city heritage route, food, travel, and modern India. The 8 minute card loop sits inside this journey."
      nextHref="/places/udaipur"
      nextLabel="Open Udaipur pilot"
      secondaryHref="/places/rajasthan"
      secondaryLabel="Rajasthan state story"
    >
      <WhereAreYou />

      <section className="mt-12" aria-labelledby="states-h">
        <h2 id="states-h" className="serif text-3xl">
          State stories
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {states.map((s) => (
            <Link key={s.slug} href={`/places/${s.slug}`} className="visual-card group block">
              <div className="relative aspect-[16/9]">
                <Image
                  src={s.hero_image.src}
                  alt={s.hero_image.alt}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="visual-card-overlay absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="serif text-2xl">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/85">{s.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="cities-h">
        <h2 id="cities-h" className="serif text-3xl">
          Cities in the pilot
        </h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Udaipur is complete end to end. Jaipur, Jodhpur, and Jaisalmer use the same data shape and
          will fill from files without code changes.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c) => {
            const siblings = c.parent_slug ? getChildCities(c.parent_slug).length : 0;
            return (
              <li key={c.slug}>
                <Link
                  href={`/places/${c.slug}`}
                  className="page-panel flex h-full flex-col p-4 hover:outline-[var(--primary)]"
                >
                  <p className="text-xs font-medium tracking-wide text-[var(--primary)] uppercase">
                    {c.state_ut}
                  </p>
                  <h3 className="serif mt-1 text-xl">{c.name}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--ink-soft)]">
                    {c.summary}
                  </p>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {siblings} cities in state map
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </PageShell>
  );
}

import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Offline , Parampara Path",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <PageShell
      width="narrow"
      crumbs={[{ href: "/", label: "Home" }, { label: "Offline" }]}
      eyebrow="No network right now"
      title="Heritage can wait a moment"
      lead="Parampara Path could not reach the network. Open a previously viewed or saved card, then reconnect when you can."
      nextHref="/"
      nextLabel="Try Home"
      secondaryHref="/passport"
      secondaryLabel="Open saved cards"
    >
      <div className="page-panel p-5 text-sm leading-relaxed text-[var(--ink-soft)]">
        <p>
          Tip: pages and cards you already opened are cached for offline reading. The map needs a
          connection the first time you load tiles.
        </p>
      </div>
    </PageShell>
  );
}

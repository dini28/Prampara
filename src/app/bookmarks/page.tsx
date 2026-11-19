import { BookmarkGrid } from "@/components/BookmarkGrid";
import { PageShell } from "@/components/PageShell";

export default function BookmarksPage() {
  return (
    <PageShell
      width="wide"
      crumbs={[{ href: "/", label: "Home" }, { label: "Saved" }]}
      eyebrow="Saved on this device"
      title="Your saved cards"
      lead="Bookmarks stay on this phone or laptop. Open a card anytime to continue Ask → Quiz → Contribute."
      nextHref="/explore"
      nextLabel="Find more cards"
      secondaryHref="/map"
      secondaryLabel="Browse the map"
    >
      <section aria-labelledby="saved-list">
        <h2 id="saved-list" className="sr-only">
          Saved heritage cards
        </h2>
        <BookmarkGrid />
      </section>
    </PageShell>
  );
}

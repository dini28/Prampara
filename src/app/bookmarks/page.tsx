import { BookmarkGrid } from "@/components/BookmarkGrid";

export default function BookmarksPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="serif text-5xl">Bookmarks</h1>
      <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
        Save cited cards for a later pass through Ask and Quiz. Bookmarks stay on this device for the
        local MVP.
      </p>
      <div className="mt-8">
        <BookmarkGrid />
      </div>
    </main>
  );
}

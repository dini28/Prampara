import { BookmarkGrid } from "@/components/BookmarkGrid";

export default function BookmarksPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="serif text-5xl">Bookmarks</h1>
      <p className="mt-3 text-[var(--muted)]">Stored in this browser. Cloud sync comes with Supabase later.</p>
      <div className="mt-8">
        <BookmarkGrid />
      </div>
    </main>
  );
}

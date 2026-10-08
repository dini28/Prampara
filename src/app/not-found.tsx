import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20">
      <h1 className="serif text-5xl">Not on this compass</h1>
      <p className="mt-4 text-[var(--ink-soft)]">
        That path is not in the curated set. Depth over coverage.
      </p>
      <Link href="/explore" className="btn mt-6 inline-block rounded-full bg-[var(--terracotta)] px-5 py-2 text-[var(--paper)]">
        Explore cards
      </Link>
    </main>
  );
}

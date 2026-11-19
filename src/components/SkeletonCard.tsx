export function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl bg-[var(--surface)] p-5 outline outline-1 outline-[var(--line)]"
      aria-hidden="true"
    >
      <div className="h-3 w-24 rounded bg-[var(--line)]" />
      <div className="mt-3 h-7 w-3/4 rounded bg-[var(--line)]" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[var(--line)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--line)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--line)]" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ n = 4 }: { n?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviewer desk — Parampara Path",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] pb-[env(safe-area-inset-bottom)]">
      {children}
    </div>
  );
}

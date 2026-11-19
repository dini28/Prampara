"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { StateTransition } from "@/components/StateTransition";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PageTransition } from "@/components/PageTransition";

function regionFromPath(pathname: string, regionParam: string | null): string | null {
  const m = pathname.match(/^\/regions\/([^/]+)/);
  if (m) return m[1] ?? null;
  if (pathname.startsWith("/explore") && regionParam) return regionParam;
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");
  const currentRegion = regionFromPath(pathname, regionParam);
  const prevRegion = useRef<string | null>(null);
  const [loaderSlug, setLoaderSlug] = useState<string | null>(null);
  const [loaderOn, setLoaderOn] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (
      currentRegion &&
      prevRegion.current &&
      currentRegion !== prevRegion.current
    ) {
      setLoaderSlug(currentRegion);
      setLoaderOn(true);
    }
    prevRegion.current = currentRegion;
  }, [currentRegion]);

  const onLoaderDone = useCallback(() => {
    startTransition(() => setLoaderOn(false));
  }, []);

  return (
    <>
      <PageTransition>
        <div className="app-shell pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </PageTransition>
      <StateTransition slug={loaderSlug} active={loaderOn} onDone={onLoaderDone} />
      <InstallPrompt />
    </>
  );
}

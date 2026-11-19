"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((t) => t + 1);
  }, [pathname]);

  return (
    <div key={tick} className="pp-page-enter ios-push min-h-[100dvh]">
      {children}
    </div>
  );
}

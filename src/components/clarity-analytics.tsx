"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "yrnkerysvr";

function ClarityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    Clarity.init(CLARITY_PROJECT_ID);
    Clarity.consentV2({
      ad_Storage: "granted",
      analytics_Storage: "granted",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    Clarity.setTag("page", url);
  }, [pathname, searchParams]);

  return null;
}

export default function ClarityAnalytics() {
  return (
    <Suspense fallback={null}>
      <ClarityTracker />
    </Suspense>
  );
}

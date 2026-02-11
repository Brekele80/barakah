"use client";

import { useSearchParams } from "next/navigation";
import PrayerWidget from "@/app/components/prayer-widget";
import HijriWidget from "@/app/components/hijri-widget";

export default function DashboardWidgets() {
  const params = useSearchParams();
  const lang = params.get("lang") ?? "20";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <HijriWidget />
      <PrayerWidget lang={lang} />
    </div>
  );
}

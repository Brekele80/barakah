"use client";

import PrayerWidget from "@/app/components/prayer-widget";
import HijriWidget from "@/app/components/hijri-widget";
import CountdownWidget from "@/app/components/countdown-widget";
import DailyHadithWidget from "@/app/components/daily-hadith-widget";

export default function DashboardWidgets({ lang }: { lang: string }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <HijriWidget />
        <PrayerWidget lang={lang} />
      </div>

      <CountdownWidget lang={lang} />
      <DailyHadithWidget lang={lang} />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

type Hijri = {
  day: string;
  month: string;
  year: string;
};

export default function HijriWidget() {
  const [date, setDate] = useState<Hijri | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const today = new Date();

        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        const res = await fetch(
          `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`
        );

        const json = await res.json();
        const h = json.data.hijri;

        setDate({
          day: h.day,
          month: h.month.en,
          year: h.year,
        });
      } catch {
        setDate(null);
      }
    }

    load();
  }, []);

  return (
    <div className="h-45 border rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-black">
      {!date ? (
        <div className="animate-pulse text-gray-400">
          Loading Hijri date…
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold">{date.day}</div>
          <div className="text-lg">{date.month}</div>
          <div className="text-gray-500">{date.year} H</div>
        </>
      )}
    </div>
  );
}

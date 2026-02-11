"use client";

import { useEffect, useState } from "react";

type EventInfo = {
  name: string;
  daysLeft: number;
};

type Props = {
  lang: string;
};

const labels: Record<string, { title: string; days: string }> = {
  "20": { title: "Next Islamic Event", days: "days remaining" },
  "33": { title: "Acara Islam Berikutnya", days: "hari lagi" },
  "31": { title: "Sonraki İslami Gün", days: "gün kaldı" },
  "85": { title: "Prochain événement islamique", days: "jours restants" },
  "97": { title: "اگلا اسلامی موقع", days: "دن باقی" },
};

export default function CountdownWidget({ lang }: Props) {
  const [event, setEvent] = useState<EventInfo | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const today = new Date();

        // FIX: API requires DD-MM-YYYY
        const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${today.getFullYear()}`;

        const res = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${dateStr}`
        );

        const json = await res.json();
        const hijri = json.data.hijri;

        const day = parseInt(hijri.day);
        const month = parseInt(hijri.month.number);

        const events = [
          { m: 9, d: 1, name: "Ramadan" },
          { m: 10, d: 1, name: "Eid al-Fitr" },
          { m: 12, d: 9, name: "Day of Arafah" },
          { m: 12, d: 10, name: "Eid al-Adha" },
          { m: 1, d: 1, name: "Islamic New Year" },
          { m: 3, d: 12, name: "Mawlid" },
        ];

        let next: EventInfo | null = null;

        for (const e of events) {
          let diff = (e.m - month) * 30 + (e.d - day);

          if (diff < 0) diff += 354;

          if (!next || diff < next.daysLeft) {
            next = {
              name: e.name,
              daysLeft: diff,
            };
          }
        }

        setEvent(next);
      } catch (err) {
        console.error("Countdown failed", err);
        setEvent(null);
      }
    }

    load();
  }, []);

  const ui = labels[lang] || labels["20"];

  return (
    <div className="h-45 border rounded-2xl p-6 bg-white dark:bg-black flex flex-col justify-center text-center mb-4">
      {!event ? (
        <div className="text-gray-400 animate-pulse">
          Loading countdown…
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-1">{ui.title}</div>

          <div className="text-xl font-semibold mb-1">
            {event.name}
          </div>

          <div className="text-3xl font-bold">
            {event.daysLeft}
          </div>

          <div className="text-sm text-gray-500">{ui.days}</div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Hadith = {
  id: string;
  title: string;
};

type Props = {
  lang: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

const labels: Record<string, string> = {
  "20": "Daily Hadith",
  "33": "Hadits Harian",
  "31": "Günün Hadisi",
  "85": "Hadith du jour",
  "97": "آج کی حدیث",
};

export default function DailyHadithWidget({ lang }: Props) {
  const [hadith, setHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const todayKey = `daily-hadith-${lang}-${new Date().toDateString()}`;
      const cached = localStorage.getItem(todayKey);

      // async boundary prevents eslint error
      if (cached) {
        const parsed = JSON.parse(cached);
        if (mounted) setHadith(parsed);
        return;
      }

      try {
        const apiLang = langMap[lang] ?? "en";

        const res = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=5&page=1&per_page=50`
        );

        const json = await res.json();
        const list = json.data ?? [];
        if (!list.length) return;

        const random = list[Math.floor(Math.random() * list.length)];

        const item = {
          id: random.id,
          title: random.title,
        };

        localStorage.setItem(todayKey, JSON.stringify(item));

        if (mounted) setHadith(item);
      } catch (e) {
        console.error("Daily hadith failed", e);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [lang]);

  return (
    <div className="h-45 border rounded-2xl p-6 bg-white dark:bg-black flex flex-col justify-between mb-4">
      <div className="text-sm text-gray-500 mb-2">
        {labels[lang] || labels["20"]}
      </div>

      {!hadith ? (
        <div className="text-gray-400 animate-pulse">
          Loading hadith…
        </div>
      ) : (
        <>
          <div className="text-sm line-clamp-4">
            {hadith.title}
          </div>

          <Link
            href={`/hadith?lang=${lang}`}
            className="text-xs mt-3 text-blue-500"
          >
            →
          </Link>
        </>
      )}
    </div>
  );
}

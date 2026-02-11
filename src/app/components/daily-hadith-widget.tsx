"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HadithBookmarkButton from "@/app/components/hadith-bookmark-button";

type Hadith = {
  id: string;
  title: string;
  source: string;
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
    let active = true;

    async function load() {
      const todayKey = `daily-hadith-${lang}-${new Date().toDateString()}`;
      const cached = localStorage.getItem(todayKey);

      if (cached) {
        if (active) setHadith(JSON.parse(cached));
        return;
      }

      try {
        const apiLang = langMap[lang] ?? "en";

        const listRes = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=5&page=1&per_page=50`
        );

        const listJson = await listRes.json();
        const list = listJson.data ?? [];
        if (!list.length) return;

        const random = list[Math.floor(Math.random() * list.length)];

        const oneRes = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${random.id}`
        );

        const oneJson = await oneRes.json();

        const item = {
          id: random.id,
          title: oneJson.hadeeth,
          source: oneJson.attribution,
        };

        localStorage.setItem(todayKey, JSON.stringify(item));
        if (active) setHadith(item);
      } catch (e) {
        console.error("Daily hadith failed", e);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <div className="h-45 border rounded-2xl p-6 bg-white dark:bg-black flex flex-col justify-between mb-4">
      <div className="text-sm text-gray-500">
        {labels[lang] || labels["20"]}
      </div>

      {!hadith ? (
        <div className="text-gray-400 animate-pulse">Loading hadith…</div>
      ) : (
        <>
          <div className="flex justify-between items-start gap-2">
            <div className="text-xs text-gray-500">{hadith.source}</div>

            <HadithBookmarkButton id={hadith.id} lang={lang} />
          </div>

          <div className="text-sm line-clamp-4">{hadith.title}</div>

          <div className="text-[10px] text-gray-400">
            Source: {hadith.source} • HadeethEnc.com
          </div>

          <Link href={`/hadith?lang=${lang}`} className="text-xs text-blue-500">
            →
          </Link>
        </>
      )}
    </div>
  );
}

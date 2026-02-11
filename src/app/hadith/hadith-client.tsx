"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Hadith = {
  text: string;
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
  "20": "Hadith",
  "33": "Hadits",
  "31": "Hadis",
  "85": "Hadith",
  "97": "حدیث",
};

export default function HadithClient({ lang }: Props) {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const apiLang = langMap[lang] ?? "en";

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // CATEGORY 5 = Virtues & Manners (stable)
        const listRes = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=5&page=1&per_page=50`
        );

        const listJson = await listRes.json();
        const list = listJson.data ?? [];

        if (!list.length) return;

        const random = list[Math.floor(Math.random() * list.length)];

        const res = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${random.id}`
        );

        const json = await res.json();

        if (!active) return;

        setHadith({
          text: json.hadeeth,
          source: json.attribution,
        });
      } catch (e) {
        console.error("Hadith error", e);
        setHadith(null);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [apiLang]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        {labels[lang] ?? labels["20"]}
      </h1>

      {!hadith ? (
        <div className="text-gray-400 animate-pulse">
          Loading hadith…
        </div>
      ) : (
        <div className="border rounded-2xl p-6 text-lg leading-relaxed">
          {hadith.text}

          <div className="text-sm text-gray-500 mt-4">
            {hadith.source}
          </div>
        </div>
      )}
    </main>
  );
}

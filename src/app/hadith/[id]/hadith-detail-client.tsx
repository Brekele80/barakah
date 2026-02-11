"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HadithBookmarkButton from "@/app/components/hadith-bookmark-button";

type Hadith = {
  id: string;
  text: string;
  source: string;
  explanation: string;
};

type Props = {
  id: string;
  lang: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

const backLabels: Record<string, string> = {
  "20": "Back",
  "33": "Kembali",
  "31": "Geri",
  "85": "Retour",
  "97": "واپس",
};

export default function HadithDetailClient({ id, lang }: Props) {
  const [hadith, setHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    async function load() {
      const apiLang = langMap[lang] ?? "en";

      const res = await fetch(
        `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${id}`
      );

      const json = await res.json();

      setHadith({
        id,
        text: json.hadeeth,
        source: json.attribution,
        explanation: json.explanation,
      });
    }

    load();
  }, [id, lang]);

  if (!hadith) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-400 animate-pulse">
        Loading hadith…
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={`/hadith?lang=${lang}`} className="text-blue-500 mb-4 inline-block" >
        ← {backLabels[lang] || "Back"}
      </Link>

      <div className="border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="text-sm text-gray-500">{hadith.source}</div>

          <HadithBookmarkButton
            id={hadith.id}
            lang={lang}
          />
        </div>

        <div className="text-xl leading-relaxed whitespace-pre-line">
          {hadith.text}
        </div>

        <div className="border-t pt-4 text-base whitespace-pre-line">
          {hadith.explanation}
        </div>

        <div className="text-xs text-gray-400 pt-2 border-t">
          Source: {hadith.source} • HadeethEnc.com
        </div>
      </div>
    </main>
  );
}

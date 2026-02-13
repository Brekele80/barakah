"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { withLang } from "@/lib/lang";
import SkeletonCard from "@/app/components/skeleton-card";

type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
};

type Word = {
  transliteration?: { text: string };
};

type VerseApiResponse = {
  verse: {
    verse_key: string;
    text_uthmani: string;
    words: Word[];
    translations: { text: string }[];
  };
};

type SearchResultApi = {
  verse_key: string;
};

type VerseDetail = {
  verse_key: string;
  text_uthmani: string;
  transliteration: string;
  translation: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

const translationMap: Record<string, string> = {
  "20": "20",
  "33": "33",
  "31": "77",
  "85": "136",
  "97": "97",
};

export default function SearchContent() {
  const params = useSearchParams();

  const query = params.get("q") ?? "";
  const lang = params.get("lang") ?? "20";

  const apiLang = langMap[lang] ?? "en";
  const translationId = translationMap[lang] ?? "20";

  const [results, setResults] = useState<VerseDetail[]>([]);
  const [surahResults, setSurahResults] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    async function run() {
      setLoading(true);

      /* ---------- SURAH SEARCH ---------- */
      try {
        const surahRes = await fetch(
          `https://api.quran.com/api/v4/chapters?language=${apiLang}`
        );
        const surahJson = await surahRes.json();

        const filtered = surahJson.chapters.filter((s: Surah) =>
          s.name_simple.toLowerCase().includes(query.toLowerCase())
        );

        setSurahResults(filtered);
      } catch {}

      /* ---------- VERSE SEARCH ---------- */
      const res = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          query
        )}&size=20&page=1&language=${apiLang}`
      );

      const data = await res.json();
      const raw: SearchResultApi[] = data.search?.results ?? [];

      const detailed: VerseDetail[] = await Promise.all(
        raw.map(async (r) => {
          const verseRes = await fetch(
            `https://api.quran.com/api/v4/verses/by_key/${r.verse_key}?words=true&translations=${translationId}&fields=text_uthmani`
          );

          const verseData: VerseApiResponse = await verseRes.json();
          const v = verseData.verse;

          const transliteration =
            v.words?.map((w: Word) => w.transliteration?.text ?? "").join(" ") ?? "";

          return {
            verse_key: r.verse_key,
            text_uthmani: v.text_uthmani,
            transliteration,
            translation: v.translations?.[0]?.text ?? "",
          };
        })
      );

      setResults(detailed);
      setLoading(false);
    }

    run();
  }, [query, apiLang, translationId]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* SURAH RESULTS */}
      {surahResults.map((s) => (
        <Link
          key={s.id}
          href={withLang(`/surah/${s.id}`, lang)}
          className="block p-4 border rounded-xl bg-green-50 dark:bg-green-900"
        >
          <div className="font-semibold">
            {s.id}. {s.name_simple}
          </div>
          <div className="text-sm text-gray-500">
            {s.translated_name.name}
          </div>
        </Link>
      ))}

      {/* VERSE RESULTS */}
      {results.map((r) => {
        const [surah, ayah] = r.verse_key.split(":");

        return (
          <Link
            key={r.verse_key}
            href={withLang(`/surah/${surah}#ayah-${ayah}`, lang)}
            className="block p-4 border rounded-xl"
          >
            <div className="text-sm text-gray-500">{r.verse_key}</div>

            <div className="arabic text-right text-2xl">
              {r.text_uthmani}
            </div>

            <div className="italic text-gray-500">
              {r.transliteration}
            </div>

            <div dangerouslySetInnerHTML={{ __html: r.translation }} />
          </Link>
        );
      })}
    </main>
  );
}

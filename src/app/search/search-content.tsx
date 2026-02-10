"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

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

/** UI language → search API language */
const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

/** UI language → translation ID (IMPORTANT) */
const translationMap: Record<string, string> = {
  "20": "20", // English
  "33": "33",  // Indonesian
  "31": "77",  // Turkish
  "85": "136", // French
  "97": "97",  // Urdu
};

const labels: Record<
  string,
  { title: string; placeholder: string; button: string }
> = {
  "20": { title: "Search", placeholder: "Search...", button: "Search" },
  "33": { title: "Cari", placeholder: "Cari...", button: "Cari" },
  "31": { title: "Ara", placeholder: "Ara...", button: "Ara" },
  "85": { title: "Recherche", placeholder: "Recherche...", button: "Rechercher" },
  "97": { title: "تلاش", placeholder: "تلاش کریں...", button: "تلاش" },
};

export default function SearchContent() {
  const params = useSearchParams();

  const query = params.get("q") ?? "";
  const lang = params.get("lang") ?? "20";

  const apiLang = langMap[lang] ?? "en";
  const translationId = translationMap[lang] ?? "131";

  const [results, setResults] = useState<VerseDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    async function run() {
      setLoading(true);

      // search API
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
            v.words?.map((w) => w.transliteration?.text ?? "").join(" ") ?? "";

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

  const ui = labels[lang] ?? labels["20"];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">{ui.title}</h1>

      <form action="/search" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder={ui.placeholder}
          className="flex-1 border rounded-lg p-2 bg-white dark:bg-black"
        />

        <input type="hidden" name="lang" value={lang} />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
        >
          {ui.button}
        </button>
      </form>

      {loading && <p>Searching...</p>}

      <div className="space-y-6">
        {results.map((r) => {
          const [surah, ayah] = r.verse_key.split(":");

          return (
            <Link
              key={r.verse_key}
              href={`/surah/${surah}?lang=${lang}#ayah-${ayah}`}
              className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="text-sm text-gray-500 mb-2">{r.verse_key}</div>

              <div className="arabic text-right text-2xl mb-2">
                {r.text_uthmani}
              </div>

              <div className="italic text-gray-500 mb-2">
                {r.transliteration}
              </div>

              <div dangerouslySetInnerHTML={{ __html: r.translation }} />
            </Link>
          );
        })}
      </div>
    </main>
  );
}

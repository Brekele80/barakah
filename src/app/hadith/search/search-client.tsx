"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HadithListItem = {
  id: string;
  title: string;
};

type HadithFull = {
  id: string;
  text: string;
  source: string;
};

type ListResponse = {
  data: HadithListItem[];
};

type Props = {
  query: string;
  lang: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

const labels: Record<
  string,
  {
    placeholder: string;
    button: string;
    searching: string;
    empty: string;
  }
> = {
  "20": {
    placeholder: "Search hadith...",
    button: "Search",
    searching: "Searching…",
    empty: "No results",
  },
  "33": {
    placeholder: "Cari hadits...",
    button: "Cari",
    searching: "Mencari…",
    empty: "Tidak ada hasil",
  },
  "31": {
    placeholder: "Hadis ara...",
    button: "Ara",
    searching: "Aranıyor…",
    empty: "Sonuç yok",
  },
  "85": {
    placeholder: "Rechercher...",
    button: "Rechercher",
    searching: "Recherche…",
    empty: "Aucun résultat",
  },
  "97": {
    placeholder: "تلاش کریں...",
    button: "تلاش",
    searching: "تلاش جاری ہے…",
    empty: "کوئی نتیجہ نہیں",
  },
};

export default function HadithSearchClient({ query, lang }: Props) {
  const apiLang = langMap[lang] ?? "en";

  const [results, setResults] = useState<HadithFull[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState(query);

  const ui = labels[lang] || labels["20"];

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let active = true;

    async function run() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=5&page=1&per_page=200`
        );

        const json: ListResponse = await res.json();
        const list = json.data ?? [];

        const filtered = list.filter((h) =>
          h.title.toLowerCase().includes(query.toLowerCase())
        );

        const full: HadithFull[] = [];

        for (const h of filtered.slice(0, 25)) {
          try {
            const one = await fetch(
              `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${h.id}`
            );

            const j = await one.json();

            full.push({
              id: h.id,
              text: j.hadeeth,
              source: j.attribution,
            });
          } catch {}
        }

        if (!active) return;
        setResults(full);
      } catch {
        if (!active) return;
        setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [query, apiLang]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* SEARCH */}
      <form action="/hadith/search" className="flex gap-2">
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ui.placeholder}
          className="flex-1 border rounded-xl p-3 bg-white dark:bg-black"
        />

        <input type="hidden" name="lang" value={lang} />

        <button className="px-4 rounded-xl border">
          {ui.button}
        </button>
      </form>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-400 animate-pulse">
          {ui.searching}
        </div>
      )}

      {/* RESULTS */}
      <div className="space-y-6">
        {results.map((h) => (
          <Link
            key={h.id}
            href={`/hadith/${h.id}?lang=${lang}`}
            className="block"
          >
            <div className="border rounded-2xl p-6 space-y-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
              
              <div className="text-sm text-gray-500">
                {h.source}
              </div>

              <div className="text-lg leading-relaxed whitespace-pre-line">
                {h.text}
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t">
                Source: {h.source} • HadeethEnc.com
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && results.length === 0 && query && (
        <div className="text-gray-500">{ui.empty}</div>
      )}
    </main>
  );
}

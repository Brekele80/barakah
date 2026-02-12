"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import PaginationArrows from "@/app/components/pagination-arrows";
import SearchSuggestions from "@/app/components/search-suggestions";
import { trending } from "@/lib/hadith-trending";

type HadithItem = {
  id: string;
  title: string;
};

type HadithFull = {
  id: string;
  text: string;
  source: string;
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

const uiText: Record<string, { placeholder: string; no: string }> = {
  "20": { placeholder: "Search hadith...", no: "No results" },
  "33": { placeholder: "Cari hadits...", no: "Tidak ada hasil" },
  "31": { placeholder: "Hadis ara...", no: "Sonuç yok" },
  "85": { placeholder: "Rechercher...", no: "Aucun résultat" },
  "97": { placeholder: "تلاش کریں...", no: "کوئی نتیجہ نہیں" },
};

export default function HadithSearchClient({ query, lang }: Props) {
  const apiLang = langMap[lang] ?? "en";
  const ui = uiText[lang] ?? uiText["20"];

  const [index, setIndex] = useState<HadithItem[]>([]);
  const [q, setQ] = useState(query);
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState<Record<string, HadithFull>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const PER_PAGE = 10;

  /* ---------------- BUILD INDEX ---------------- */
  useEffect(() => {
    async function buildIndex() {
      const cacheKey = `hadith-index-${apiLang}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setIndex(JSON.parse(cached));
        return;
      }

      try {
        const catRes = await fetch(
          `https://hadeethenc.com/api/v1/categories/roots/?language=${apiLang}`
        );
        const categories: { id: string }[] = await catRes.json();

        const map = new Map<string, HadithItem>();

        for (const c of categories) {
          const res = await fetch(
            `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=${c.id}&page=1&per_page=2000`
          );

          const json = await res.json();
          const data = json.data ?? [];

          for (const h of data) {
            if (!map.has(h.id)) {
              map.set(h.id, { id: h.id, title: h.title });
            }
          }
        }

        const all = Array.from(map.values());
        localStorage.setItem(cacheKey, JSON.stringify(all));
        setIndex(all);
      } catch {}
    }

    buildIndex();
  }, [apiLang]);

  /* ---------------- FUSE ---------------- */
  const fuse = useMemo(() => {
    return new Fuse(index, {
      keys: ["title"],
      threshold: 0.45,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!q) return [];
    return fuse.search(q).map((r) => r.item);
  }, [q, fuse]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(results.length / PER_PAGE);
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [q]);

  /* ---------------- LOAD DETAILS ---------------- */
  useEffect(() => {
    if (!paginated.length) return;

    async function loadDetails() {
      const missing = paginated.filter((h) => !details[h.id]);
      if (!missing.length) return;

      const newDetails: Record<string, HadithFull> = {};

      for (const item of missing) {
        try {
          const res = await fetch(
            `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${item.id}`
          );

          const json = await res.json();

          newDetails[item.id] = {
            id: item.id,
            text: json.hadeeth,
            source: json.attribution,
          };
        } catch {}
      }

      setDetails((prev) => ({ ...prev, ...newDetails }));
    }

    loadDetails();
  }, [paginated, apiLang, details]);

  /* ---------------- SEARCH HISTORY ---------------- */
  useEffect(() => {
    if (!q) return;
    const key = `hadith-history-${lang}`;
    const prev = JSON.parse(localStorage.getItem(key) || "[]");

    if (!prev.includes(q)) {
      localStorage.setItem(key, JSON.stringify([q, ...prev.slice(0, 5)]));
    }
  }, [q, lang]);

  const suggestions = useMemo(() => {
    if (!q) return [];
    return results.slice(0, 5);
  }, [results, q]);

  /* ---------------- UI ---------------- */
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder={ui.placeholder}
          className="w-full border rounded-xl p-3 bg-white dark:bg-black"
        />

        {showSuggestions && q && (
          <SearchSuggestions
            items={suggestions}
            lang={lang}
            onSelect={() => setShowSuggestions(false)}
          />
        )}
      </div>

      {/* TRENDING */}
      {!q && (
        <div className="flex flex-wrap gap-2">
          {(trending[lang] || []).map((t) => (
            <button
              key={t}
              onClick={() => setQ(t)}
              className="px-3 py-1 border rounded-full text-sm"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* RESULTS */}
      <div className="space-y-6">
        {paginated.map((h) => {
          const full = details[h.id];

          return (
            <Link
              key={`${h.id}-${lang}`}
              href={`/hadith/${h.id}?lang=${lang}`}
              className="block"
            >
              <div className="border rounded-2xl p-6 space-y-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition">

                {full && (
                  <div className="text-sm text-gray-500">{full.source}</div>
                )}

                <div className="text-lg whitespace-pre-line">
                  {full ? highlight(full.text, q) : highlight(h.title, q)}
                </div>

                {full && (
                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Source: {full.source} • HadeethEnc.com
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {!results.length && q && (
        <div className="text-gray-500">{ui.no}</div>
      )}

      <PaginationArrows page={page} total={totalPages} onChange={setPage} />
    </main>
  );
}

/* highlight */
function highlight(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q})`, "gi"));

  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-700">
        {p}
      </mark>
    ) : (
      p
    )
  );
}

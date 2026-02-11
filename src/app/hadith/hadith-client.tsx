"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Hadith = {
  id: string;
  text: string;
  source: string;
};

type Category = {
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

const randomLabels: Record<string, string> = {
  "20": "Random Hadith",
  "33": "Hadits Acak",
  "31": "Rastgele",
  "85": "Aléatoire",
  "97": "بے ترتیب",
};

export default function HadithClient({ lang }: Props) {
  const apiLang = langMap[lang] ?? "en";

  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>("5");
  const [loading, setLoading] = useState(true);

  // 🔹 load categories once per language
  useEffect(() => {
    async function loadCategories() {
      const res = await fetch(
        `https://hadeethenc.com/api/v1/categories/roots/?language=${apiLang}`
      );
      const json = await res.json();
      setCategories(json);
    }

    loadCategories();
  }, [apiLang]);

  // 🔹 stable hadith loader
  const loadHadith = useCallback(async () => {
    try {
      setLoading(true);

      const listRes = await fetch(
        `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=${category}&page=1&per_page=50`
      );

      const listJson = await listRes.json();
      const list = listJson.data ?? [];

      if (!list.length) {
        setHadith(null);
        setLoading(false);
        return;
      }

      const random = list[Math.floor(Math.random() * list.length)];

      const res = await fetch(
        `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${random.id}`
      );

      const json = await res.json();

      setHadith({
        id: random.id,
        text: json.hadeeth,
        source: json.attribution,
      });

      setLoading(false);
    } catch {
      setHadith(null);
      setLoading(false);
    }
  }, [apiLang, category]);

  // 🔹 run when category or language changes
  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);

        const listRes = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/list/?language=${apiLang}&category_id=${category}&page=1&per_page=50`
        );

        const listJson = await listRes.json();
        const list = listJson.data ?? [];

        if (!list.length) {
          if (active) {
            setHadith(null);
            setLoading(false);
          }
          return;
        }

        const random = list[Math.floor(Math.random() * list.length)];

        const res = await fetch(
          `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${random.id}`
        );

        const json = await res.json();

        if (active) {
          setHadith({
            id: random.id,
            text: json.hadeeth,
            source: json.attribution,
          });
          setLoading(false);
        }
      } catch {
        if (active) {
          setHadith(null);
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [apiLang, category]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      {/* controls */}
      <div className="flex gap-2 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            border rounded-xl px-3 py-2
            bg-white text-black
            dark:bg-zinc-900 dark:text-white
            dark:border-zinc-700
          "
        >
          {categories.map((c) => (
            <option
              key={c.id}
              value={c.id}
              className="bg-white text-black dark:bg-zinc-900 dark:text-white"
            >
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={loadHadith}
          className="
            border rounded-xl px-3 py-2
            bg-white text-black
            dark:bg-zinc-900 dark:text-white
            dark:border-zinc-700
            hover:bg-gray-100 dark:hover:bg-zinc-800
            transition
          "
        >
          {randomLabels[lang] || randomLabels["20"]}
        </button>
      </div>

      {/* hadith */}
      {loading ? (
        <div className="text-gray-400 animate-pulse">
          Loading hadith…
        </div>
      ) : hadith ? (
        <div className="border rounded-2xl p-6 text-lg leading-relaxed">
          {hadith.text}

          <div className="text-sm text-gray-500 mt-4">
            {hadith.source}
          </div>
        </div>
      ) : (
        <div>No hadith found</div>
      )}
    </main>
  );
}

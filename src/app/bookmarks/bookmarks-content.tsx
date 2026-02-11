"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredLang } from "@/lib/lang";
import { getHadithBookmarks } from "@/lib/hadith-bookmarks";

type QuranBookmark = {
  key: string;
  surah: string;
  ayah: string;
};

type HadithFull = {
  id: string;
  text: string;
  source: string;
};

const backLabels: Record<string, string> = {
  "20": "Back",
  "33": "Kembali",
  "31": "Geri",
  "85": "Retour",
  "97": "واپس",
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

function readQuranBookmarks(): QuranBookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("bookmarks") || "[]");
  } catch {
    return [];
  }
}

export default function BookmarksContent() {
  const params = useSearchParams();
  const urlLang = params.get("lang");
  const lang = urlLang ?? getStoredLang();

  const [tab, setTab] = useState<"quran" | "hadith">("quran");

  const [quranBookmarks] = useState<QuranBookmark[]>(readQuranBookmarks);
  const [hadithList, setHadithList] = useState<HadithFull[]>([]);

  // 🔥 fetch bookmarked hadith in selected language
  useEffect(() => {
    async function load() {
      const apiLang = langMap[lang] ?? "en";
      const saved = getHadithBookmarks();

      const full: HadithFull[] = [];

      for (const h of saved) {
        try {
          const res = await fetch(
            `https://hadeethenc.com/api/v1/hadeeths/one/?language=${apiLang}&id=${h.id}`
          );
          const json = await res.json();

          full.push({
            id: h.id,
            text: json.hadeeth,
            source: json.attribution,
          });
        } catch {}
      }

      setHadithList(full);
    }

    load();
  }, [lang]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← {backLabels[lang] || "Back"}
      </Link>

      <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("quran")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "quran"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "opacity-60"
          }`}
        >
          Quran
        </button>

        <button
          onClick={() => setTab("hadith")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "hadith"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "opacity-60"
          }`}
        >
          Hadith
        </button>
      </div>

      {/* QURAN */}
      {tab === "quran" && (
        <div className="space-y-3">
          {quranBookmarks.map((b) => (
            <Link
              key={b.key}
              href={`/surah/${b.surah}?lang=${lang}#ayah-${b.ayah}`}
              className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Surah {b.surah} — Ayah {b.ayah}
            </Link>
          ))}
        </div>
      )}

      {/* HADITH */}
      {tab === "hadith" && (
        <div className="space-y-6">
          {hadithList.map((h) => (
            <div key={h.id} className="border rounded-2xl p-6 space-y-4">
              <div className="text-sm text-gray-500">{h.source}</div>

              <div className="text-lg leading-relaxed whitespace-pre-line">
                {h.text}
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t">
                Source: {h.source} • HadeethEnc.com
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

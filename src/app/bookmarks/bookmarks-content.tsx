"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredLang } from "@/lib/lang";
import { getHadithBookmarks } from "@/lib/hadith-bookmarks";
import { withLang } from "@/lib/lang";
import SkeletonCard from "@/app/components/skeleton-card";
import { getDuaBookmarks } from "@/lib/dua-bookmarks";
import { loadDuas } from "@/lib/duas";
import type { DuaFull } from "@/lib/duas";

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

const tabLabels: Record<
  string,
  { quran: string; hadith: string; duas: string; title: string }
> = {
  "20": {
    quran: "Quran",
    hadith: "Hadith",
    duas: "Duas",
    title: "Bookmarks",
  },
  "33": {
    quran: "Al-Qur'an",
    hadith: "Hadits",
    duas: "Doa",
    title: "Bookmark",
  },
  "31": {
    quran: "Kur'an",
    hadith: "Hadis",
    duas: "Dualar",
    title: "Yer İmleri",
  },
  "85": {
    quran: "Coran",
    hadith: "Hadith",
    duas: "Invocations",
    title: "Favoris",
  },
  "97": {
    quran: "قرآن",
    hadith: "حدیث",
    duas: "دعائیں",
    title: "بُک مارکس",
  },
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

export default function BookmarksContent() {
  const params = useSearchParams();
  const urlLang = params.get("lang");
  const lang = urlLang ?? getStoredLang();

  const [tab, setTab] = useState<"quran" | "hadith" | "duas">("quran");
  const tTabs = tabLabels[lang] ?? tabLabels["20"];

  const [quranBookmarks, setQuranBookmarks] = useState<QuranBookmark[] | null>(null);
  const [hadithList, setHadithList] = useState<HadithFull[] | null>(null);
  const [duaList, setDuaList] = useState<DuaFull[] | null>(null);

  // 🔹 load quran bookmarks safely
  useEffect(() => {
    async function run() {
      const data = (() => {
        try {
          return JSON.parse(localStorage.getItem("bookmarks") || "[]");
        } catch {
          return [];
        }
      })();

      setQuranBookmarks(data);
    }

    run();
  }, []);

  // 🔹 load hadith bookmarks in selected language
  useEffect(() => {
    let active = true;

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

      if (active) setHadithList(full);
    }

    load();

    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadDuaBookmarks() {
      const saved = getDuaBookmarks();

      if (!saved.length) {
        setDuaList([]);
        return;
      }

      const all = await loadDuas(lang);

      const list: DuaFull[] = saved
        .map((b) => all.find((d: DuaFull) => d.id === b.id))
        .filter((d): d is DuaFull => Boolean(d));

      if (active) setDuaList(list);
    }

    loadDuaBookmarks();

    return () => {
      active = false;
    };
  }, [lang]);

  if (!quranBookmarks) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={withLang("/", lang)} className="text-blue-500 mb-4 inline-block">
        ← {backLabels[lang] || "Back"}
      </Link>

      <h1 className="text-2xl font-bold mb-6">{tTabs.title}</h1>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("quran")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "quran"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "opacity-60"
          }`}
        >
          {tTabs.quran}
        </button>

        <button
          onClick={() => setTab("hadith")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "hadith"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "opacity-60"
          }`}
        >
          {tTabs.hadith}
        </button>

        <button
          onClick={() => setTab("duas")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "duas"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "opacity-60"
          }`}
        >
          {tTabs.duas}
        </button>
      </div>

      {/* QURAN */}
      {tab === "quran" && (
        <div className="space-y-3">
          {quranBookmarks.map((b) => (
            <Link
              key={b.key}
              href={withLang(`/surah/${b.surah}#ayah-${b.ayah}`, lang)}
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
          {!hadithList ? (
            <div className="text-gray-400">Loading…</div>
          ) : (
            hadithList.map((h) => (
              <Link
                key={h.id}
                href={withLang(`/hadith/${h.id}`, lang)}
                className="block"
              >
                <div className="border rounded-2xl p-6 space-y-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
                  <div className="text-sm text-gray-500">{h.source}</div>

                  <div className="text-lg leading-relaxed whitespace-pre-line">
                    {h.text}
                  </div>

                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Source: {h.source} • HadeethEnc.com
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* DUAS */}
      {tab === "duas" && (
        <div className="space-y-3">
          {!duaList ? (
            <SkeletonCard />
          ) : (
            duaList.map((d) => (
              <Link
                key={d.id}
                href={withLang(`/duas/${d.id}`, lang)}
                className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {d.title}
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
}

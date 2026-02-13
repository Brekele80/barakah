"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackToTop from "@/app/components/back-to-top";
import { Share2 } from "lucide-react";
import { getTafsir } from "@/lib/tafsir-engine";

type Props = {
  surah: string;
  ayah: string;
  lang: string;
};

type AyahData = {
  arabic: string;
  translation: string;
  tafsir: string;
};

const backLabels: Record<string, string> = {
  "20": "Back",
  "33": "Kembali",
  "31": "Geri",
  "85": "Retour",
  "97": "واپس",
};

const translationMap: Record<string, string> = {
  "20": "20",
  "33": "33",
  "31": "77",
  "85": "136",
  "97": "97",
};

export default function AyahDetailClient({ surah, ayah, lang }: Props) {
  const [data, setData] = useState<AyahData | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const translationId = translationMap[lang] || "20";
        const ayahKey = `${surah}:${ayah}`;

        /* ---------- VERSE ---------- */
        const verseRes = await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${ayahKey}?fields=text_uthmani&translations=${translationId}`
        );

        const verseJson = await verseRes.json();
        const verse = verseJson?.verse ?? null;

        /* ---------- TAFSIR ENGINE ---------- */
        const tafsirText = await getTafsir(lang, surah, ayah);

        if (!active || !verse) return;

        setData({
          arabic: verse.text_uthmani ?? "",
          translation: verse.translations?.[0]?.text ?? "",
          tafsir: tafsirText ?? "",
        });
      } catch (err) {
        console.error("Ayah load failed", err);
        if (!active) return;
        setData(null);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [surah, ayah, lang]);

  /* ---------- SHARE ---------- */
  function handleShare() {
    const url = `${window.location.origin}/ayah/${surah}/${ayah}?lang=${lang}`;

    if (navigator.share) {
      navigator.share({
        title: `Qur'an ${surah}:${ayah}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-400 animate-pulse">
        Loading ayah…
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link
        href={`/surah/${surah}?lang=${lang}#ayah-${ayah}`}
        className="text-blue-500 inline-block"
      >
        ← {backLabels[lang] || "Back"}
      </Link>

      <div className="border rounded-2xl p-6 space-y-6">
        {/* Arabic */}
        {data.arabic && (
          <p className="arabic text-right text-4xl leading-loose">
            {data.arabic}
          </p>
        )}

        {/* Translation */}
        {data.translation && (
          <div
            className="text-lg"
            dangerouslySetInnerHTML={{ __html: data.translation }}
          />
        )}

        {/* Tafsir */}
        {data.tafsir && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Tafsir</h2>

              <button
                onClick={handleShare}
                className="p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div
              className="text-base whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: data.tafsir }}
            />
          </div>
        )}
      </div>

      <BackToTop />
    </main>
  );
}

"use client";

import { useState } from "react";
import BookmarkButton from "./bookmark-button";

type Word = {
  transliteration?: { text: string };
};

type Verse = {
  id: number;
  verse_number: number;
  text_uthmani: string;
  words: Word[];
  translations: { text: string }[];
};

function buildTransliteration(words: Word[]) {
  return words
    ?.map((w) => w.transliteration?.text)
    .filter(Boolean)
    .join(" ");
}

const savedLabels: Record<string, string> = {
  "20": "Last read saved",
  "33": "Posisi terakhir disimpan",
  "31": "Son okunan kaydedildi",
  "85": "Dernière lecture enregistrée",
  "97": "آخری پڑھی ہوئی جگہ محفوظ ہوگئی",
};

export default function VerseBlock({
  verse,
  surahId,
  lang,
}: {
  verse: Verse;
  surahId: string;
  lang: string;
}) {
  const [show, setShow] = useState(false);

  function saveLastRead() {
    const last = { surah: surahId, ayah: verse.verse_number };
    localStorage.setItem("lastRead", JSON.stringify(last));

    setShow(true);
    setTimeout(() => setShow(false), 1500);
  }

  return (
    <div
      id={`ayah-${verse.verse_number}`}
      className="border-b pb-8 pt-4 relative"
    >
      <div className="absolute right-0 top-0">
        <BookmarkButton verseKey={`${surahId}:${verse.verse_number}`} />
      </div>

      {/* Arabic */}
      <p
        className="arabic text-right text-4xl leading-loose mb-3 cursor-pointer pr-10"
        onClick={saveLastRead}
      >
        {verse.text_uthmani}
        <span className="text-sm ml-2 text-gray-500">
          ({verse.verse_number})
        </span>
      </p>

      {show && (
        <div className="text-green-600 text-sm mb-2">
          {savedLabels[lang] || "Saved"}
        </div>
      )}

      <p className="italic text-gray-500 mb-2">
        {buildTransliteration(verse.words)}
      </p>

      <p
        dangerouslySetInnerHTML={{
          __html: verse.translations?.[0]?.text || "",
        }}
      />
    </div>
  );
}

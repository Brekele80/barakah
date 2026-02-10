"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBookmarks, Bookmark } from "@/lib/bookmarks";

const labels: Record<string, string> = {
  "20": "Bookmarks",
  "33": "Penanda",
  "31": "Yer imleri",
  "85": "Favoris",
  "97": "بک مارکس",
};

export default function BookmarksPage() {
  const params = useSearchParams();
  const lang = params.get("lang") || "20";

  const [bookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === "undefined") return [];
    return getBookmarks();
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        {labels[lang] || "Bookmarks"}
      </h1>

      {bookmarks.length === 0 && (
        <p className="text-gray-500">No bookmarks yet</p>
      )}

      <div className="space-y-3">
        {bookmarks.map((b) => (
          <Link
            key={b.key}
            href={`/surah/${b.surah}?lang=${lang}#ayah-${b.ayah}`}
            className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Surah {b.surah} — Ayah {b.ayah}
          </Link>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getStoredLang } from "@/lib/lang";

type Bookmark = {
  key: string;
  surah: string;
  ayah: string;
};

function readBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("bookmarks");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BookmarksContent() {
  const params = useSearchParams();

  const urlLang = params.get("lang");
  const lang = urlLang ?? getStoredLang();

  const [bookmarks] = useState<Bookmark[]>(readBookmarks);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

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

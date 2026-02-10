"use client";

import Link from "next/link";
import { useState } from "react";

type LastRead = {
  surah: string;
  ayah: number;
} | null;

const labels: Record<string, string> = {
  "20": "Continue reading",
  "33": "Lanjut membaca",
  "31": "Okumaya devam et",
  "85": "Continuer la lecture",
  "97": "پڑھنا جاری رکھیں",
};

function readLastRead(): LastRead {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("lastRead");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.surah || !parsed?.ayah) return null;

    return parsed;
  } catch {
    return null;
  }
}

export default function ContinueReading({ lang }: { lang: string }) {
  // initialize directly from localStorage
  const [last] = useState<LastRead>(readLastRead);

  if (!last) return null;

  return (
    <div className="mb-6 p-4 border rounded-xl bg-green-50 dark:bg-green-900">
      <p className="text-sm mb-2">
        {labels[lang] || labels["20"]}
      </p>

      <Link
        href={`/surah/${last.surah}?lang=${lang}#ayah-${last.ayah}`}
        className="font-semibold underline"
      >
        Surah {last.surah} — Ayah {last.ayah}
      </Link>
    </div>
  );
}

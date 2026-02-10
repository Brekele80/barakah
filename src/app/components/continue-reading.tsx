"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

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

let cached: LastRead = null;

function getSnapshot(): LastRead {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("lastRead");
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      cached &&
      parsed.surah === cached.surah &&
      parsed.ayah === cached.ayah
    ) {
      return cached; // return SAME reference
    }

    cached = parsed;
    return cached;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function ContinueReading({ lang }: { lang: string }) {
  const last = useSyncExternalStore(subscribe, getSnapshot, () => null);

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

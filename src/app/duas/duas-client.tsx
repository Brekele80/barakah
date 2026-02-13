"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { withLang } from "@/lib/lang";
import type { Dua } from "@/lib/duas";

type Props = {
  duas: Dua[];
  lang: string;
};

export default function DuasClient({ duas, lang }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    duas.forEach((d) => d.category && set.add(d.category));
    return Array.from(set);
  }, [duas]);

  const filtered = useMemo(() => {
    return duas.filter((d) => {
      const matchQ =
        !q ||
        d.title.toLowerCase().includes(q.toLowerCase()) ||
        d.translation.toLowerCase().includes(q.toLowerCase());

      const matchCat = cat === "all" || d.category === cat;

      return matchQ && matchCat;
    });
  }, [duas, q, cat]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <Link href={withLang("/", lang)} className="text-blue-500">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold">Duas</h1>

      {/* SEARCH */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search dua..."
        className="w-full border rounded-lg p-2"
      />

      {/* CATEGORIES */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setCat("all")} className="px-3 py-1 border rounded">
          All
        </button>

        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="px-3 py-1 border rounded"
          >
            {c}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((d) => (
          <Link
            key={d.id}
            href={withLang(`/duas/${d.id}`, lang)}
            className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {d.title}
          </Link>
        ))}
      </div>
    </main>
  );
}

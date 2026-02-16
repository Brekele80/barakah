import { loadDuas } from "@/lib/duas/loader";
import { categoryLabels } from "@/lib/duas/categories";
import { withLang } from "@/lib/lang";
import Link from "next/link";

const backLabels: Record<string, string> = {
  "20": "Back",
  "33": "Kembali",
  "31": "Geri",
  "85": "Retour",
  "97": "واپس",
};

export default async function DuaCategory({
  params,
  searchParams,
}: {
  params: Promise<{ cat: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { cat } = await params;
  const { lang = "20" } = await searchParams;

  const raw = await loadDuas(lang);
  const duas = Array.isArray(raw) ? raw : [];

  const filtered = duas.filter((d) => d.category === cat);

  const labels = categoryLabels[lang] ?? categoryLabels["20"];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/duas", lang)} className="text-blue-500 mb-4">
        ← {backLabels[lang] ?? "Back"}
      </Link>

      <h1 className="text-2xl font-bold">
        {labels[cat] ?? cat}
      </h1>

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

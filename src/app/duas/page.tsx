import { loadDuas } from "@/lib/duas/loader";
import { categoryLabels } from "@/lib/duas/categories";
import { groupByCategory } from "@/lib/duas/group";
import { withLang } from "@/lib/lang";
import Link from "next/link";

const ui: Record<string, { title: string; back: string; search: string }> = {
  "20": { title: "Duas", back: "Back", search: "Search..." },
  "33": { title: "Doa", back: "Kembali", search: "Cari..." },
  "31": { title: "Dualar", back: "Geri", search: "Ara..." },
  "85": { title: "Invocations", back: "Retour...", search: "Rechercher" },
  "97": { title: "دعائیں", back: "واپس", search: "تلاش" },
};

export default async function DuasPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;
  const t = ui[lang] ?? ui["20"];

  const raw = await loadDuas(lang);
  const duas = Array.isArray(raw) ? raw : [];

  const grouped = groupByCategory(duas);
  const labels = categoryLabels[lang] ?? categoryLabels["20"];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/", lang)} className="text-blue-500">
        ← {t.back}
      </Link>

      <h1 className="text-3xl font-bold">{t.title}</h1>

      <Link
        href={withLang("/duas/search", lang)}
        className="block border rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {t.search}
      </Link>

      <div className="space-y-3">
        {Object.entries(grouped).map(([cat, list]) => (
          <Link
            key={cat}
            href={withLang(`/duas/category/${cat}`, lang)}
            className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex justify-between">
              <span>{labels[cat] ?? cat}</span>
              <span className="opacity-60">{list.length}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

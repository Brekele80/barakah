import { searchDuas } from "@/lib/duas/search";
import { withLang } from "@/lib/lang";
import Link from "next/link";

const ui: Record<
  string,
  { title: string; back: string; empty: string; placeholder: string }
> = {
  "20": {
    title: "Search Duas",
    back: "Back",
    empty: "No results found",
    placeholder: "Search duas…",
  },
  "33": {
    title: "Cari Doa",
    back: "Kembali",
    empty: "Tiada hasil",
    placeholder: "Cari doa…",
  },
  "31": {
    title: "Dua Ara",
    back: "Geri",
    empty: "Sonuç yok",
    placeholder: "Dua ara…",
  },
  "85": {
    title: "Rechercher",
    back: "Retour",
    empty: "Aucun résultat",
    placeholder: "Rechercher…",
  },
  "97": {
    title: "دعائیں تلاش کریں",
    back: "واپس",
    empty: "کوئی نتیجہ نہیں",
    placeholder: "تلاش کریں…",
  },
};

export default async function DuaSearch({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string }>;
}) {
  const { lang = "20", q = "" } = await searchParams;
  const t = ui[lang] ?? ui["20"];

  const results = await searchDuas(lang, q);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/duas", lang)} className="text-blue-500">
        ← {t.back}
      </Link>

      <h1 className="text-2xl font-bold">{t.title}</h1>

      {/* search form */}
      <form>
        <input
          name="q"
          defaultValue={q}
          placeholder={t.placeholder}
          className="w-full border rounded-xl p-3"
        />
        <input type="hidden" name="lang" value={lang} />
      </form>

      {/* results */}
      {q && results.length === 0 && (
        <div className="text-gray-400">{t.empty}</div>
      )}

      <div className="space-y-3">
        {results.map((d) => (
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

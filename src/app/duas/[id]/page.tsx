import { loadDuas } from "@/lib/duas/loader";
import { withLang } from "@/lib/lang";
import Link from "next/link";
import DuaBookmarkButton from "@/app/components/dua-bookmark-button";

const ui: Record<string, { back: string; notfound: string }> = {
  "20": { back: "Back", notfound: "Not found" },
  "33": { back: "Kembali", notfound: "Tidak ditemukan" },
  "31": { back: "Geri", notfound: "Bulunamadı" },
  "85": { back: "Retour", notfound: "Introuvable" },
  "97": { back: "واپس", notfound: "نہیں ملا" },
};

export default async function DuaDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang = "20" } = await searchParams;
  const t = ui[lang] ?? ui["20"];

  const raw = await loadDuas(lang);
  const duas = Array.isArray(raw) ? raw : [];
  const dua = duas.find((d) => d.id === id);

  if (!dua)
    return <div className="p-6">{t.notfound}</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/duas", lang)} className="text-blue-500 mb-4">
        ← {t.back}
      </Link>

      <div className="border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{dua.title}</h1>
          <DuaBookmarkButton id={dua.id} />
        </div>

        <p className="arabic text-right text-3xl">{dua.arabic}</p>

        {dua.transliteration && (
          <p className="italic text-gray-500">
            {dua.transliteration}
          </p>
        )}

        <p>{dua.translation}</p>

        {dua.source && (
          <div className="text-xs text-gray-400 border-t pt-2">
            {dua.source}
          </div>
        )}
      </div>
    </main>
  );
}

import { loadDuas } from "@/lib/duas";
import { withLang } from "@/lib/lang";
import Link from "next/link";
import DuaBookmarkButton from "@/app/components/dua-bookmark-button";

export default async function DuaDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang = "20" } = await searchParams;

  const duas = await loadDuas(lang);
  const dua = duas.find((d) => d.id === id);

  if (!dua) return <div className="p-6">Not found</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/duas", lang)} className="text-blue-500">
        ← Back
      </Link>

      <div className="border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{dua.title}</h1>
          <DuaBookmarkButton id={dua.id} />
        </div>

        <p className="arabic text-right text-3xl">{dua.arabic}</p>

        {dua.transliteration && (
          <p className="italic text-gray-500">{dua.transliteration}</p>
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

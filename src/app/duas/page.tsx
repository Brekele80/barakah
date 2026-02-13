import { loadDuas } from "@/lib/duas";
import Link from "next/link";
import { withLang } from "@/lib/lang";

export default async function DuasPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;
  const duas = await loadDuas(lang);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <Link href={withLang("/", lang)} className="text-blue-500">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold">Duas</h1>

      <div className="space-y-3">
        {duas.map((d) => (
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

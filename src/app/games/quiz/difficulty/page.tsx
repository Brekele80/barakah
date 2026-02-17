import Link from "next/link";
import { withLang } from "@/lib/lang";
import { difficultyConfig } from "@/lib/quiz/difficulty";

export default async function DifficultyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "33" } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Pilih Tingkat</h1>

      {Object.entries(difficultyConfig).map(([key, cfg]) => (
        <Link
          key={key}
          href={withLang(`/games/quiz/play?d=${key}`, lang)}
          className="block p-5 rounded-2xl border hover:bg-gray-100 dark:hover:bg-zinc-900"
        >
          <div className="flex justify-between">
            <span>{cfg.label}</span>
            <span>{cfg.count} soal</span>
          </div>
        </Link>
      ))}
    </main>
  );
}

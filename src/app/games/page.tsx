import Link from "next/link";
import { withLang } from "@/lib/lang";

const ui: Record<string, { title: string; quiz: string; crossword: string }> = {
  "33": {
    title: "Permainan",
    quiz: "Kuis Islami",
    crossword: "Teka Teki (segera)",
  },
  "20": {
    title: "Games",
    quiz: "Islamic Quiz",
    crossword: "Crossword (soon)",
  },
};

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "33" } = await searchParams;
  const t = ui[lang] ?? ui["33"];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t.title}</h1>

      <Link
        href={withLang("/games/quiz", lang)}
        className="block p-6 rounded-2xl border bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-[1.02] transition"
      >
        🎮 {t.quiz}
      </Link>

      <div className="p-6 border rounded-2xl opacity-60">
        🧩 {t.crossword}
      </div>
    </main>
  );
}

import Link from "next/link";
import { withLang } from "@/lib/lang";

const labels: Record<string, string> = {
  "20": "Games",
  "33": "Permainan",
  "31": "Oyunlar",
  "85": "Jeux",
  "97": "کھیل",
};

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;
  const title = labels[lang] ?? labels["20"];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>

      <Link
        href={withLang("/games/quiz", lang)}
        className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        🧠 Quiz
      </Link>

      <Link
        href={withLang("/games/crossword", lang)}
        className="block p-4 border rounded-xl opacity-50 pointer-events-none"
      >
        🧩 Crossword (Soon)
      </Link>
    </main>
  );
}

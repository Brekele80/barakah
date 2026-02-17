import Link from "next/link";
import { withLang } from "@/lib/lang";

const ui: Record<string, { play: string; title: string }> = {
  "33": {
    title: "Kuis Islami",
    play: "Mainkan",
  },
  "20": {
    title: "Islamic Quiz",
    play: "Play",
  },
};

export default async function QuizHome({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "33" } = await searchParams;
  const t = ui[lang] ?? ui["33"];

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700 text-white">
      <h1 className="text-4xl font-bold mb-10">{t.title}</h1>

      <Link
        href={withLang("/games/quiz/difficulty", lang)}
        className="px-10 py-4 bg-white text-black rounded-2xl text-xl font-semibold shadow-xl"
      >
        ▶ {t.play}
      </Link>
    </main>
  );
}

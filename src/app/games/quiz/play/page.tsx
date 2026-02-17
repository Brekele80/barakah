import { startQuiz } from "@/lib/quiz/engine";
import QuizPlayer from "./player";
import type { QuizDifficulty } from "@/lib/quiz/types";

export default async function QuizPlay({
  searchParams,
}: {
  searchParams: Promise<{ d?: QuizDifficulty; lang?: string }>;
}) {
  const { d = "easy", lang = "33" } = await searchParams;

  const session = await startQuiz(d);

  return <QuizPlayer session={session} lang={lang} />;
}

import type { QuizDifficulty, QuizQuestion } from "./types";
import { difficultyConfig } from "./difficulty";

export async function loadQuizQuestions(
  difficulty: QuizDifficulty
): Promise<QuizQuestion[]> {
  const data = await import(`@/data/quiz/id/${difficulty}.json`);
  return data.default as QuizQuestion[];
}

export async function startQuiz(
  difficulty: QuizDifficulty
) {
  const all = await loadQuizQuestions(difficulty);

  const cfg = difficultyConfig[difficulty];

  const shuffled = shuffle(all).slice(0, cfg.count);

  return {
    difficulty,
    questions: shuffled,
    current: 0,
    score: 0,
    startTime: Date.now(),
  };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

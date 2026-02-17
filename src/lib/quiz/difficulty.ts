import type { QuizDifficulty } from "./types";

export const difficultyConfig = {
  easy: {
    label: "Pemula",
    time: 15,
    count: 20,
  },
  medium: {
    label: "Menengah",
    time: 12,
    count: 30,
  },
  hard: {
    label: "Sulit",
    time: 10,
    count: 40,
  },
  expert: {
    label: "Ahli",
    time: 5,
    count: 50,
  },
} satisfies Record<
  QuizDifficulty,
  { label: string; time: number; count: number }
>;

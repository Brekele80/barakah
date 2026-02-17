export type QuizDifficulty = "easy" | "medium" | "hard" | "expert";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  category: string;
};

export type QuizSession = {
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  current: number;
  score: number;
  startTime: number;
};

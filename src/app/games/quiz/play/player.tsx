"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizSession } from "@/lib/quiz/types";
import { difficultyConfig } from "@/lib/quiz/difficulty";
import { useRouter } from "next/navigation";

export default function QuizPlayer({
  session,
  lang,
}: {
  session: QuizSession;
  lang: string;
}) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const cfg = difficultyConfig[session.difficulty];
  const [time, setTime] = useState(cfg.time);

  const q = session.questions[index];

  const next = useCallback(() => {
    if (index + 1 >= session.questions.length) {
      router.push(`/games/quiz/result?score=${score}&lang=${lang}`);
      return;
    }

    setIndex((i) => i + 1);
    setTime(cfg.time);
  }, [index, session.questions.length, score, lang, router, cfg.time]);

  function answer(i: number) {
    if (i === q.answer) setScore((s) => s + 1);

    // delay so UI doesn't clash
    setTimeout(next, 150);
  }

  useEffect(() => {
    if (time <= 0) {
      // 🔧 IMPORTANT: defer state change
      const t = setTimeout(next, 0);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => {
      setTime((v) => v - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, next]);

  return (
    <main className="h-screen flex flex-col justify-center items-center p-6 space-y-6">
      <div className="text-lg">Waktu: {time}</div>

      <h2 className="text-xl font-bold text-center">{q.question}</h2>

      <div className="grid gap-3 w-full max-w-md">
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="p-4 rounded-xl border hover:bg-gray-100 dark:hover:bg-zinc-900"
          >
            {o}
          </button>
        ))}
      </div>
    </main>
  );
}

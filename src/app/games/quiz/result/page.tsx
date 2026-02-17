"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();

  const score = params.get("score") ?? 0;
  const lang = params.get("lang") ?? "33";

  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time <= 0) return;
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  function continueGame() {
    router.push(`/games/quiz/leaderboard?score=${score}&lang=${lang}`);
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Skor: {score}</h1>

      {time > 0 ? (
        <div className="text-lg">Iklan {time}s</div>
      ) : (
        <button
          onClick={continueGame}
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          Lanjut
        </button>
      )}
    </main>
  );
}

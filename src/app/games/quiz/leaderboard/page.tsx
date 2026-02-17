"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Score = {
  name: string;
  score: number;
};

function loadScores(): Score[] {
  try {
    return JSON.parse(localStorage.getItem("quizScores") || "[]");
  } catch {
    return [];
  }
}

export default function Leaderboard() {
  const params = useSearchParams();
  const score = Number(params.get("score") ?? 0);

  const [name, setName] = useState("");
  const [list, setList] = useState<Score[]>(loadScores);

  function submit() {
    if (!name.trim()) return;

    const entry = { name, score };

    const updated = [...list, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    localStorage.setItem("quizScores", JSON.stringify(updated));
    setList(updated);
    setName("");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Leaderboard</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
        className="border p-2 w-full rounded"
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Simpan
      </button>

      <div className="space-y-2 pt-4">
        {list.map((s, i) => (
          <div key={i} className="flex justify-between">
            <span>{s.name}</span>
            <span>{s.score}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

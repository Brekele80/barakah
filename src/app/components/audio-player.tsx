"use client";

import { useState, useRef } from "react";

const labels: Record<string, { play: string; pause: string }> = {
  "20": { play: "Play Recitation", pause: "Pause Recitation" }, // English
  "33": { play: "Putar Bacaan", pause: "Jeda Bacaan" }, // Indonesian
  "31": { play: "Tilaveti Oynat", pause: "Duraklat" }, // Turkish
  "85": { play: "Lire la récitation", pause: "Pause" }, // French
  "97": { play: "تلاوت چلائیں", pause: "وقفہ" }, // Urdu
};

export default function AudioPlayer({
  surahId,
  lang,
}: {
  surahId: string;
  lang: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`;

  const text = labels[lang] || labels["20"];

  function toggle() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="my-4">
      <button
        onClick={toggle}
        className="px-4 py-2 border rounded"
      >
        {playing ? text.pause : text.play}
      </button>

      <audio ref={audioRef} src={src} />
    </div>
  );
}

"use client";

import { useState, useRef } from "react";

export default function AudioPlayer({ surahId }: { surahId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`;

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
        {playing ? "Pause Recitation" : "Play Recitation"}
      </button>

      <audio ref={audioRef} src={src} />
    </div>
  );
}

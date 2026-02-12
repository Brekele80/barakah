"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

type Props = {
  id: string;
  lang: string;
};

export default function HadithShareButton({ id, lang }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/hadith/${id}?lang=${lang}`;

    // mobile native share
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hadith",
          url,
        });
        return;
      } catch {
        return;
      }
    }

    // fallback copy
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleShare}
      className="p-1 opacity-70 hover:opacity-100 transition"
      aria-label="share"
    >
      <Share2 className="w-5 h-5" />
      {copied && (
        <span className="ml-2 text-xs text-green-500">
          Copied
        </span>
      )}
    </button>
  );
}

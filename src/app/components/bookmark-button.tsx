"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark, isBookmarked } from "@/lib/bookmarks";

export default function BookmarkButton({ verseKey }: { verseKey: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(verseKey));
  }, [verseKey]);

  function handleClick() {
    toggleBookmark(verseKey);
    setSaved((s) => !s);
  }

  return (
    <button
      onClick={handleClick}
      className="p-1"
      aria-label="bookmark"
    >
      <Bookmark
        className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
      />
    </button>
  );
}

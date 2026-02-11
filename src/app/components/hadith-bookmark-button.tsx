"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import {
  toggleHadithBookmark,
  isHadithBookmarked,
} from "@/lib/hadith-bookmarks";

type Props = {
  id: string;
  lang: string;
};

export default function HadithBookmarkButton({ id, lang }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isHadithBookmarked(id));
  }, [id]);

  function toggle() {
    toggleHadithBookmark({ id, lang });
    setSaved(!saved);
  }

  return (
    <button onClick={toggle}>
      <Bookmark
        className={`w-5 h-5 ${
          saved ? "fill-current text-white" : "opacity-50"
        }`}
      />
    </button>
  );
}

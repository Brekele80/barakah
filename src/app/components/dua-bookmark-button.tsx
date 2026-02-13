"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";
import { toggleDuaBookmark, getDuaBookmarks } from "@/lib/dua-bookmarks";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(id: string) {
  const list = getDuaBookmarks();
  return list.some((d) => d.id === id);
}

export default function DuaBookmarkButton({ id }: { id: string }) {
  const saved = useSyncExternalStore(
    subscribe,
    () => getSnapshot(id),
    () => false
  );

  function toggle() {
    toggleDuaBookmark(id);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <button onClick={toggle}>
      <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}

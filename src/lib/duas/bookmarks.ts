import { DuaID } from "./types";

const KEY = "dua-bookmarks";

export type DuaBookmark = {
  id: DuaID;
};

export function getDuaBookmarks(): DuaBookmark[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleDuaBookmark(id: DuaID) {
  if (typeof window === "undefined") return;

  const list = getDuaBookmarks();
  const exists = list.some((d) => d.id === id);

  const next = exists
    ? list.filter((d) => d.id !== id)
    : [...list, { id }];

  localStorage.setItem(KEY, JSON.stringify(next));
}

export function isDuaSaved(id: DuaID): boolean {
  return getDuaBookmarks().some((d) => d.id === id);
}

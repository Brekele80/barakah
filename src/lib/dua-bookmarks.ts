export type DuaBookmark = {
  id: string;
};

const KEY = "dua-bookmarks";

export function getDuaBookmarks(): DuaBookmark[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleDuaBookmark(id: string) {
  if (typeof window === "undefined") return;

  const current = getDuaBookmarks();
  const exists = current.find((d) => d.id === id);

  const next = exists
    ? current.filter((d) => d.id !== id)
    : [...current, { id }];

  localStorage.setItem(KEY, JSON.stringify(next));
}

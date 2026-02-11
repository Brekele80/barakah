export type HadithBookmark = {
  id: string;
  lang: string; // language it was saved in
};

const KEY = "hadithBookmarks";

export function getHadithBookmarks(): HadithBookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleHadithBookmark(h: HadithBookmark) {
  const list = getHadithBookmarks();
  const exists = list.find((b) => b.id === h.id);

  let updated;

  if (exists) {
    updated = list.filter((b) => b.id !== h.id);
  } else {
    updated = [h, ...list];
  }

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function isHadithBookmarked(id: string) {
  return getHadithBookmarks().some((b) => b.id === id);
}

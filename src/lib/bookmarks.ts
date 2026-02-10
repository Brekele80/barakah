export type Bookmark = {
  key: string; // "2:255"
  surah: string;
  ayah: string;
};

const STORAGE_KEY = "bookmarks";

function safeParse(raw: string | null): Bookmark[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    // ensure array
    if (Array.isArray(parsed)) return parsed;

    return [];
  } catch {
    return [];
  }
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
}

export function toggleBookmark(key: string) {
  if (typeof window === "undefined") return;

  const [surah, ayah] = key.split(":");

  const bookmarks = getBookmarks();
  const exists = bookmarks.find((b) => b.key === key);

  let updated: Bookmark[];

  if (exists) {
    updated = bookmarks.filter((b) => b.key !== key);
  } else {
    updated = [...bookmarks, { key, surah, ayah }];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function isBookmarked(key: string) {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.key === key);
}

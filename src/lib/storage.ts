export function getStoredLang(): string {
  if (typeof window === "undefined") return "20";
  return localStorage.getItem("lang") || "20";
}

export function setStoredLang(lang: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lang", lang);
}

export type LastRead = {
  surah: string;
  ayah: number;
};

export function getLastRead(): LastRead | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("lastRead");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastRead(surah: string, ayah: number) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "lastRead",
    JSON.stringify({ surah, ayah })
  );
}

export type Bookmark = {
  key: string;
  surah: string;
  ayah: string;
};

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("bookmarks");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(list: Bookmark[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bookmarks", JSON.stringify(list));
}

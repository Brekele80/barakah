/* ===============================
   LANGUAGE ENGINE (PRODUCTION)
   =============================== */

export const DEFAULT_LANG = "20";
export const LANG_COOKIE = "lang";

/* ---------------------------------
   URL PARAM
---------------------------------- */
export function getLangFromSearchParams(
  params: URLSearchParams | { get(name: string): string | null } | null
): string {
  if (!params) return DEFAULT_LANG;
  return params.get("lang") ?? DEFAULT_LANG;
}

/* ---------------------------------
   LOCAL STORAGE
---------------------------------- */
export function getStoredLang(): string {
  if (typeof window === "undefined") return DEFAULT_LANG;

  try {
    return localStorage.getItem("lang") ?? DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function setStoredLang(lang: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

/* ---------------------------------
   COOKIE (SSR READY)
---------------------------------- */
export function getLangFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setLangCookie(lang: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000`;
}

/* ---------------------------------
   FINAL RESOLUTION
---------------------------------- */
export function resolveLang(urlLang?: string | null): string {
  if (urlLang) return urlLang;

  const cookie = getLangFromCookie();
  if (cookie) return cookie;

  return getStoredLang();
}

/* ---------------------------------
   SAFE URL BUILDER (STRICT ENGINE)
---------------------------------- */
export function withLang(path: string, lang: string): string {
  if (!path) return `/?lang=${lang}`;

  // already has hash → preserve it
  const hasHash = path.includes("#");

  let base = path;
  let hash = "";

  if (hasHash) {
    const parts = path.split("#");
    base = parts[0];
    hash = "#" + parts[1];
  }

  // build URL safely
  const url = new URL(base, "http://dummy");

  url.searchParams.set("lang", lang);

  return url.pathname + url.search + hash;
}

/* ---------------------------------
   SYNC STORAGE → URL (HEADER FIX)
---------------------------------- */
export function syncLangToUrl(
  currentUrlLang: string | null,
  routerReplace: (url: string) => void,
  currentPath: string,
  params: URLSearchParams
) {
  if (typeof window === "undefined") return;

  const stored = getStoredLang();
  if (!stored) return;
  if (stored === currentUrlLang) return;

  const newParams = new URLSearchParams(params.toString());
  newParams.set("lang", stored);

  routerReplace(`${currentPath}?${newParams.toString()}`);
}

/* ---------------------------------
   SAVE LANG EVERYWHERE
---------------------------------- */
export function persistLang(lang: string) {
  setStoredLang(lang);
  setLangCookie(lang);
}

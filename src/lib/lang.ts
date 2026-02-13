/* ===============================
   LANGUAGE ENGINE (PRODUCTION)
   =============================== */

export const DEFAULT_LANG = "20";

/**
 * Read language from URLSearchParams
 */
export function getLangFromSearchParams(
  params: URLSearchParams | { get(name: string): string | null } | null
): string {
  if (!params) return DEFAULT_LANG;
  return params.get("lang") ?? DEFAULT_LANG;
}

/**
 * Safe read from localStorage
 */
export function getStoredLang(): string {
  if (typeof window === "undefined") return DEFAULT_LANG;

  try {
    return localStorage.getItem("lang") ?? DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

/**
 * Write language to localStorage
 */
export function setStoredLang(lang: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

/**
 * Resolve final language
 */
export function resolveLang(urlLang?: string | null): string {
  if (urlLang) return urlLang;
  return getStoredLang();
}

/**
 * Build link with lang
 */
export function withLang(path: string, lang: string): string {
  if (!path.includes("?")) {
    return `${path}?lang=${lang}`;
  }

  const url = new URL(path, "http://dummy");
  url.searchParams.set("lang", lang);

  return url.pathname + url.search + url.hash;
}

/**
 * Sync storage → URL (header hydration fix)
 */
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

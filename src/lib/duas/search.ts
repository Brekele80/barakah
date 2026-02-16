import { loadDuas } from "./loader";
import { buildSearchIndex } from "./search-index";
import type { DuaFull } from "./types";

/*
GLOBAL CACHE
Safe for Vercel serverless
Resets on cold start (perfect)
*/

const CACHE = new Map<string, DuaFull[]>();

function makeKey(lang: string, query: string, category?: string) {
  return `${lang}|${query}|${category ?? ""}`;
}

/*
FUZZY MATCH (lightweight)
Allows small typos
*/

function fuzzyIncludes(text: string, query: string): boolean {
  if (text.includes(query)) return true;

  // small typo tolerance
  const words = text.split(" ");
  return words.some((w) => levenshtein(w, query) <= 2);
}

/*
LEVENSHTEIN DISTANCE
Very fast small implementation
*/

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/*
MAIN SEARCH
*/

export async function searchDuas(
  lang: string,
  query: string,
  category?: string
): Promise<DuaFull[]> {
  const key = makeKey(lang, query, category);

  if (CACHE.has(key)) return CACHE.get(key)!;

  const all = await loadDuas(lang);
  if (!Array.isArray(all)) return [];

  if (!query && !category) {
    CACHE.set(key, all);
    return all;
  }

  const q = query.toLowerCase().trim();
  const index = buildSearchIndex(all);

  const ids = index
    .filter((item) => {
      const matchText =
        !q ||
        fuzzyIncludes(item.text, q); // <-- fuzzy enabled

      const matchCat = !category || item.category === category;

      return matchText && matchCat;
    })
    .map((i) => i.id);

  const result = all.filter((d) => ids.includes(d.id));

  CACHE.set(key, result);
  return result;
}

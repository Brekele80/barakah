import { loadProphets } from "./loader";
import { buildProphetIndex } from "./search-index";
import type { ProphetStory } from "./types";

/*
PRODUCTION SEARCH ENGINE
- SSR safe
- cached per language
- fast lookup
*/

type CacheEntry = {
  index: ReturnType<typeof buildProphetIndex>;
  data: ProphetStory[];
};

const cache = new Map<string, CacheEntry>();

export async function searchProphets(
  query: string,
  lang: string
): Promise<ProphetStory[]> {
  // load from cache or build once
  let entry = cache.get(lang);

  if (!entry) {
    const data = await loadProphets(lang);
    const index = buildProphetIndex(data);

    entry = { index, data };
    cache.set(lang, entry);
  }

  if (!query) return entry.data;

  const q = query.toLowerCase().trim();

  const ids = entry.index
    .filter((i) => i.text.includes(q))
    .map((i) => i.id);

  return entry.data.filter((p) => ids.includes(p.id));
}

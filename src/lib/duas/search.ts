import { loadDuas } from "./loader";
import type { DuaFull } from "./types";

export async function searchDuas(
  query: string,
  lang: string
): Promise<DuaFull[]> {
  const raw = await loadDuas(lang);
  const duas = Array.isArray(raw) ? raw : [];

  const q = query.toLowerCase().trim();
  if (!q) return [];

  return duas.filter((d) => {
    return (
      d.title.toLowerCase().includes(q) ||
      d.translation.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

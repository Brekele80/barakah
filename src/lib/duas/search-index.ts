import type { DuaFull } from "./types";

/*
Build lightweight searchable index.
Runs once per request (cheap).
Later we can memoize globally.
*/

export type DuaSearchItem = {
  id: string;
  title: string;
  category: string;
  text: string;
};

export function buildSearchIndex(duas: DuaFull[]): DuaSearchItem[] {
  return duas.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    text: (
      d.title +
      " " +
      d.translation +
      " " +
      (d.transliteration ?? "")
    ).toLowerCase(),
  }));
}

import type { DuaFull } from "./types";

export function groupByCategory(duas: DuaFull[]) {
  const map: Record<string, DuaFull[]> = {};

  for (const d of duas) {
    if (!map[d.category]) map[d.category] = [];
    map[d.category].push(d);
  }

  return map;
}

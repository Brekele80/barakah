import type {
  DuaIndexItem,
  DuaLanguageFile,
  DuaFull,
} from "./types";

import indexData from "@/data/duas/index.json";
import en from "@/data/duas/en.json";
import id from "@/data/duas/id.json";
import tr from "@/data/duas/tr.json";
import fr from "@/data/duas/fr.json";
import ur from "@/data/duas/ur.json";

const langMap: Record<string, DuaLanguageFile> = {
  "20": en,
  "33": id,
  "31": tr,
  "85": fr,
  "97": ur,
};

/* ---------------- SAFE INDEX PARSER ---------------- */

type RawIndexItem = {
  id?: unknown;
  category?: unknown;
  tags?: unknown;
  source?: unknown;
};

function normalizeIndexItem(item: RawIndexItem): DuaIndexItem {
  return {
    id: String(item.id ?? ""),
    category: typeof item.category === "string" ? item.category : "general",
    tags: Array.isArray(item.tags)
      ? item.tags.map(String)
      : [],
    source:
      typeof item.source === "string" ? item.source : undefined,
  };
}

/* ---------------- MAIN LOADER ---------------- */

export async function loadDuas(lang: string): Promise<DuaFull[]> {
  const languageFile = langMap[lang] ?? en;

  const rawArray: RawIndexItem[] = Array.isArray(indexData)
    ? indexData
    : Object.values(indexData as Record<string, RawIndexItem>);

  const indexArray: DuaIndexItem[] = rawArray.map(normalizeIndexItem);

  const result: DuaFull[] = [];

  for (const item of indexArray) {
    const content = languageFile[item.id];
    if (!content) continue;

    result.push({
      id: item.id,
      category: item.category,
      tags: item.tags,
      source: item.source,
      title: content.title,
      arabic: content.arabic,
      transliteration: content.transliteration,
      translation: content.translation,
    });
  }

  return Array.isArray(result) ? result : [];
}

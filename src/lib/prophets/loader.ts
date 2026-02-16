import type { ProphetStory } from "./types"

import id from "@/data/prophets/id.json"
import en from "@/data/prophets/en.json"
import tr from "@/data/prophets/tr.json"
import fr from "@/data/prophets/fr.json"
import ur from "@/data/prophets/ur.json"

const map: Record<string, Record<string, ProphetStory>> = {
  "33": id,
  "20": en,
  "31": tr,
  "85": fr,
  "97": ur,
}

/* 🔥 MEMORY CACHE */
const cache = new Map<string, ProphetStory[]>()

export async function loadProphets(lang: string): Promise<ProphetStory[]> {
  if (cache.has(lang)) return cache.get(lang)!

  const file = map[lang] ?? en
  const arr = Object.values(file)

  cache.set(lang, arr)
  return arr
}

export async function loadProphetById(
  id: string,
  lang: string
): Promise<ProphetStory | null> {
  const all = await loadProphets(lang)
  return all.find((p) => p.id === id) ?? null
}

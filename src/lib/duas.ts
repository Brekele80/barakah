export type Dua = {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  transliteration?: string;
  category?: string;
  source?: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

export async function loadDuas(lang: string): Promise<Dua[]> {
  const code = langMap[lang] ?? "en";

  try {
    const data = await import(`@/data/duas/${code}.json`);
    return data.default;
  } catch {
    const fallback = await import(`@/data/duas/en.json`);
    return fallback.default;
  }
}

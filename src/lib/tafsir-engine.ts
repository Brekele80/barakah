/* =========================================================
   HYBRID TAFSIR ENGINE
   - Local tafsir per language (JSON)
   - Fallback to English API
   - Memory cache
   - Zero-cost MVP safe
========================================================= */

type TafsirFile = Record<string, string>;

/* ---------------------------------------------------------
   LANGUAGE → folder mapping
--------------------------------------------------------- */
const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

/* ---------------------------------------------------------
   MEMORY CACHE
--------------------------------------------------------- */
const tafsirMemoryCache: Record<string, TafsirFile> = {};

/* ---------------------------------------------------------
   LOAD LOCAL TAFSIR FILE
--------------------------------------------------------- */
async function loadLocalTafsir(
  lang: string,
  surah: string
): Promise<TafsirFile | null> {
  try {
    const code = langMap[lang];
    if (!code || code === "en") return null;

    const cacheKey = `${code}-${surah}`;
    if (tafsirMemoryCache[cacheKey]) {
      return tafsirMemoryCache[cacheKey];
    }

    let file: TafsirFile | null = null;

    if (code === "id") {
      const mod = await import(`@/data/tafsir/id/${surah}.json`);
      file = mod.default;
    }

    if (code === "tr") {
      const mod = await import(`@/data/tafsir/tr/${surah}.json`);
      file = mod.default;
    }

    if (code === "fr") {
      const mod = await import(`@/data/tafsir/fr/${surah}.json`);
      file = mod.default;
    }

    if (code === "ur") {
      const mod = await import(`@/data/tafsir/ur/${surah}.json`);
      file = mod.default;
    }

    if (file) {
      tafsirMemoryCache[cacheKey] = file;
    }

    return file;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------
   FETCH ENGLISH TAFSIR (API)
--------------------------------------------------------- */
async function fetchEnglishTafsir(
  surah: string,
  ayah: string
): Promise<string> {
  try {
    const ayahKey = `${surah}:${ayah}`;

    const res = await fetch(
      `https://api.quran.com/api/v4/quran/tafsirs/169?verse_key=${ayahKey}`,
      { cache: "force-cache" }
    );

    const json = await res.json();

    return json.tafsirs?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------
   MAIN ENGINE
--------------------------------------------------------- */
export async function getTafsir(
  lang: string,
  surah: string,
  ayah: string
): Promise<string> {
  try {
    /* 1️⃣ local language tafsir */
    const local = await loadLocalTafsir(lang, surah);
    if (local && local[ayah]) {
      return local[ayah];
    }

    /* 2️⃣ fallback english API */
    return await fetchEnglishTafsir(surah, ayah);
  } catch {
    return "";
  }
}

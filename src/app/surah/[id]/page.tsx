import Link from "next/link";
import AudioPlayer from "@/app/components/audio-player";
import VerseBlock from "@/app/components/verse-block";
import ScrollToAyah from "@/app/components/scroll-to-ayah";
import BackToTop from "@/app/components/back-to-top";

const backLabels: Record<string, string> = {
  "20": "Back",
  "33": "Kembali",
  "31": "Geri",
  "85": "Retour",
  "97": "واپس",
};

type Word = {
  transliteration?: { text: string };
};

type Verse = {
  id: number;
  verse_number: number;
  text_uthmani: string;
  words: Word[];
  translations: { text: string }[];
};

async function getSurahInfo(id: string, lang: string) {
  const langMap: Record<string, string> = {
    "20": "en",
    "33": "id",
    "31": "tr",
    "85": "fr",
    "97": "ur",
  };

  const apiLang = langMap[lang] || "en";

  const res = await fetch(
    `https://api.quran.com/api/v4/chapters/${id}?language=${apiLang}`
  );
  const data = await res.json();
  return data.chapter;
}

const translationMap: Record<string, string> = {
  "20": "20", // English
  "33": "33",  // Indonesian
  "31": "77",  // Turkish
  "85": "136", // French
  "97": "97",  // Urdu
};

async function getData(id: string, lang: string): Promise<Verse[]> {
  try {
    const translationId = translationMap[lang] || "131";

    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${id}?words=true&translations=${translationId}&fields=text_uthmani`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    return data.verses;
  } catch (err) {
    console.error("Quran API failed:", err);
    return [];
  }
}


export default async function SurahPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang: urlLang } = await searchParams;

  const lang =
    urlLang ??
    (typeof window !== "undefined"
      ? localStorage.getItem("lang") ?? "20"
      : "20");

  const [verses, chapter] = await Promise.all([
    getData(id, lang),
    getSurahInfo(id, lang),
  ]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href={`/quran?lang=${lang}`} className="text-blue-500 mb-4 inline-block">
        ← {backLabels[lang] || "Back"}
      </Link>

      {/* Surah title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{chapter.name_simple}</h1>
        <p className="text-xl arabic">{chapter.name_arabic}</p>
        <p className="text-gray-500">{chapter.translated_name.name}</p>
      </div>

      <AudioPlayer surahId={id} lang={lang} />
      <ScrollToAyah />

      <div className="space-y-10 mt-6">
        {verses.map((v) => (
          <VerseBlock key={v.id} verse={v} surahId={id} lang={lang} />
        ))}
      </div>
      <BackToTop />
    </main>
  );
}


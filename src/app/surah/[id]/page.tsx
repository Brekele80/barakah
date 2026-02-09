import Link from "next/link";
import LanguageSelector from "@/app/components/language-selector";
import AudioPlayer from "@/app/components/audio-player";

type Word = {
  transliteration?: { text: string };
};

type Verse = {
  id: number;
  text_uthmani: string;
  words: Word[];
  translations: { text: string }[];
};

function buildTransliteration(words: Word[]) {
  return words
    ?.map((w) => w.transliteration?.text)
    .filter(Boolean)
    .join(" ");
}

async function getData(id: string, lang: string): Promise<Verse[]> {
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${id}?words=true&translations=${lang}&fields=text_uthmani`,
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
  const { lang = "20" } = await searchParams;

  const verses = await getData(id, lang);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <LanguageSelector currentLang={lang} id={id} />
      
      <AudioPlayer surahId={id} />

      <div className="space-y-10 mt-6">
        {verses.map((v) => (
          <div key={v.id} className="border-b pb-8">

            {/* Arabic */}
            <p className="arabic text-right text-4xl leading-loose mb-3">
              {v.text_uthmani}
            </p>

            {/* Transliteration */}
            <p className="italic text-gray-500 mb-2">
              {buildTransliteration(v.words)}
            </p>

            {/* Translation */}
            <p
              dangerouslySetInnerHTML={{
                __html: v.translations?.[0]?.text || "",
              }}
            />

          </div>
        ))}
      </div>
    </main>
  );
}

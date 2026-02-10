import Link from "next/link";
import GlobalLanguageSelector from "./components/global-language-selector";

type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

async function getSurahs(lang: string): Promise<Surah[]> {
  const apiLang = langMap[lang] || "en";

  const res = await fetch(
    `https://api.quran.com/api/v4/chapters?language=${apiLang}`,
    { cache: "force-cache" }
  );

  const data = await res.json();
  return data.chapters;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;
  const surahs = await getSurahs(lang);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Qur&apos;an</h1>
        <GlobalLanguageSelector />
      </div>

      <div className="grid gap-3">
        {surahs.map((s) => (
          <Link
            key={s.id}
            href={`/surah/${s.id}?lang=${lang}`}
            className="p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition block"
          >
            <div className="flex justify-between">
              <span>
                {s.id}. {s.name_simple}
              </span>
              <span>{s.name_arabic}</span>
            </div>

            <div className="text-sm text-gray-500">
              {s.translated_name.name}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

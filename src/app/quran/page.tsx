import Link from "next/link";
import ContinueReading from "@/app/components/continue-reading";

type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
  verses_count: number;
};

type SearchUI = {
  placeholder: string;
  button: string;
};

const langMap: Record<string, string> = {
  "20": "en",
  "33": "id",
  "31": "tr",
  "85": "fr",
  "97": "ur",
};

const searchLabels: Record<string, SearchUI> = {
  "20": { placeholder: "Search...", button: "Search" },
  "33": { placeholder: "Cari...", button: "Cari" },
  "31": { placeholder: "Ara...", button: "Ara" },
  "85": { placeholder: "Recherche...", button: "Rechercher" },
  "97": { placeholder: "تلاش کریں...", button: "تلاش" },
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

export default async function QuranPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const { lang = "20" } = await searchParams;
  const surahs = await getSurahs(lang);

  const ui = searchLabels[lang] || searchLabels["20"];

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Qur&apos;an</h1>
      </div>

      {/* SEARCH */}
      <form action="/search" className="mb-6 flex gap-2">
        <input
          name="q"
          placeholder={ui.placeholder}
          className="flex-1 border rounded-lg p-2 bg-white dark:bg-black"
        />

        <input type="hidden" name="lang" value={lang} />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
        >
          {ui.button}
        </button>
      </form>

      {/* CONTINUE READING */}
      <ContinueReading lang={lang} />

      {/* SURAH LIST */}
      <div className="grid gap-3">
        {surahs.map((s) => (
          <Link
            key={s.id}
            href={`/surah/${s.id}?lang=${lang}`}
            className="p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition block"
          >
            <div className="flex justify-between">
              <span>
                {s.id}. {s.name_simple} ({s.verses_count})
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

import Link from "next/link";

type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
};

async function getSurahs(): Promise<Surah[]> {
  const res = await fetch("https://api.quran.com/api/v4/chapters", {
    cache: "force-cache",
  });

  const data = await res.json();
  return data.chapters;
}

export default async function HomePage() {
  const surahs = await getSurahs();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Barakah Quran</h1>

      <div className="grid gap-3">
        {surahs.map((s) => (
          <Link
            key={s.id}
            href={`/surah/${s.id}`}
            className="p-4 border rounded-xl hover:bg-gray-100 transition block"
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

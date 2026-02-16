import { loadProphets } from "@/lib/prophets"
import { withLang } from "@/lib/lang"
import Link from "next/link"

const ui: Record<string, { title: string; back: string }> = {
  "20": { title: "Stories of the Prophets", back: "Back" },
  "33": { title: "Kisah Para Nabi", back: "Kembali" },
  "31": { title: "Peygamber Hikayeleri", back: "Geri" },
  "85": { title: "Histoires des prophètes", back: "Retour" },
  "97": { title: "انبیاء کے قصے", back: "واپس" },
}

export default async function ProphetsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang = "20" } = await searchParams
  const t = ui[lang] ?? ui["20"]

  const prophets = await loadProphets(lang)

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/", lang)} className="text-blue-500">
        ← {t.back}
      </Link>

      <h1 className="text-3xl font-bold">{t.title}</h1>

      <Link
        href={withLang("/prophets/search", lang)}
        className="block border rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        🔎 Search
      </Link>

      <div className="space-y-3">
        {prophets.map((p) => (
          <Link
            key={p.id}
            href={withLang(`/prophets/${p.id}`, lang)}
            className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm opacity-60">{p.summary}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}

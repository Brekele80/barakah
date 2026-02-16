import { searchProphets } from "@/lib/prophets"
import { withLang } from "@/lib/lang"
import Link from "next/link"

export default async function ProphetSearch({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string }>
}) {
  const { lang = "20", q = "" } = await searchParams
  const results = await searchProphets(q, lang)

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/prophets", lang)} className="text-blue-500">
        ← Back
      </Link>

      <form>
        <input
          name="q"
          defaultValue={q}
          className="w-full border rounded-xl p-3"
          placeholder="Search prophets..."
        />
        <input type="hidden" name="lang" value={lang} />
      </form>

      <div className="space-y-3">
        {results.map((p) => (
          <Link
            key={p.id}
            href={withLang(`/prophets/${p.id}`, lang)}
            className="block p-4 border rounded-xl"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </main>
  )
}

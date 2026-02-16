import { loadProphetById } from "@/lib/prophets"
import { withLang } from "@/lib/lang"
import Link from "next/link"

const ui: Record<string, { back: string }> = {
  "20": { back: "Back" },
  "33": { back: "Kembali" },
  "31": { back: "Geri" },
  "85": { back: "Retour" },
  "97": { back: "واپس" },
}

export default async function ProphetDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { id } = await params
  const { lang = "20" } = await searchParams
  const t = ui[lang] ?? ui["20"]

  const prophet = await loadProphetById(id, lang)
  if (!prophet) return <div className="p-6">Not found</div>

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href={withLang("/prophets", lang)} className="text-blue-500">
        ← {t.back}
      </Link>

      <h1 className="text-3xl font-bold">{prophet.title}</h1>

      {prophet.story.map((p, i) => (
        <p key={i} className="leading-relaxed">
          {p}
        </p>
      ))}

      <div className="border-t pt-4 space-y-2">
        <h2 className="font-semibold">Lessons</h2>
        <ul className="list-disc ml-5">
          {prophet.lessons.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      <div className="text-xs opacity-60">
        {prophet.refs.join(" • ")}
      </div>
    </main>
  )
}

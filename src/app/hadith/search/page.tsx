import HadithSearchClient from "@/app/hadith/search/search-client";

export default async function HadithSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const { q = "", lang = "20" } = await searchParams;

  return <HadithSearchClient query={q} lang={lang} />;
}

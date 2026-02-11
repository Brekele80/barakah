import HadithClient from "@/app/hadith/hadith-client";

export default async function HadithPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;

  return <HadithClient lang={lang} />;
}

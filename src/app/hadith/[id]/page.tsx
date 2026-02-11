import HadithDetailClient from "@/app/hadith/[id]/hadith-detail-client";

export default async function HadithDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang = "20" } = await searchParams;

  return <HadithDetailClient id={id} lang={lang} />;
}

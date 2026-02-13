import AyahDetailClient from "@/app/ayah/[surah]/[ayah]/ayah-detail-client";

export default async function AyahDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ surah: string; ayah: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { surah, ayah } = await params;
  const { lang = "20" } = await searchParams;

  return <AyahDetailClient surah={surah} ayah={ayah} lang={lang} />;
}

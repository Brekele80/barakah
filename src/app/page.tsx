import Link from "next/link";
import DashboardWidgets from "@/app/components/dashboard-widgets";
import { withLang } from "@/lib/lang";

type DashboardUI = {
  quran: string;
  hadith: string;
  zakat: string;
  tafsir: string;
  duas: string;
  qibla: string;
  stories: string;
  donations: string;
  tagline: string;
};

const dashboardText: Record<string, DashboardUI> = {
  "20": {
    quran: "The Holy Qur'an",
    hadith: "Hadith",
    zakat: "Zakat Calculator",
    tafsir: "Tafsir",
    duas: "Duas",
    qibla: "Qibla",
    stories: "Stories of the Prophets",
    donations: "Donations",
    tagline: "Faith. Giving. Guidance.",
  },
  "33": {
    quran: "Al-Qur'an",
    hadith: "Hadits",
    zakat: "Kalkulator Zakat",
    tafsir: "Tafsir",
    duas: "Doa",
    qibla: "Arah Kiblat",
    stories: "Kisah Para Nabi",
    donations: "Donasi",
    tagline: "Faith. Giving. Guidance.",
  },
  "31": {
    quran: "Kur'an-ı Kerim",
    hadith: "Hadis",
    zakat: "Zekat Hesaplayıcı",
    tafsir: "Tefsir",
    duas: "Dualar",
    qibla: "Kıble",
    stories: "Peygamber Hikayeleri",
    donations: "Bağış",
    tagline: "Faith. Giving. Guidance.",
  },
  "85": {
    quran: "Le Saint Coran",
    hadith: "Hadith",
    zakat: "Calculateur de Zakat",
    tafsir: "Tafsir",
    duas: "Invocations",
    qibla: "Qibla",
    stories: "Histoires des Prophètes",
    donations: "Dons",
    tagline: "Faith. Giving. Guidance.",
  },
  "97": {
    quran: "القرآن الكريم",
    hadith: "حدیث",
    zakat: "زکوٰۃ کیلکولیٹر",
    tafsir: "تفسیر",
    duas: "دعائیں",
    qibla: "قبلہ",
    stories: "انبیاء کے واقعات",
    donations: "عطیات",
    tagline: "Faith. Giving. Guidance.",
  },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = "20" } = await searchParams;
  const t = dashboardText[lang] ?? dashboardText["20"];

  return (
    <main className="max-w-3xl mx-auto p-6 text-center">

      {/* TAGLINE */}
      <p className="text-gray-500 mb-6">{t.tagline}</p>

      {/* WIDGETS */}
      <DashboardWidgets lang={lang} />

      {/* FEATURES */}
      <div className="grid gap-4">

        <FeatureCard href="/quran" lang={lang}>{t.quran}</FeatureCard>
        <FeatureCard href="/hadith" lang={lang}>{t.hadith}</FeatureCard>
        <FeatureCard href="/zakat" lang={lang}>{t.zakat}</FeatureCard>
        <FeatureCard href="/tafsir" lang={lang}>{t.tafsir}</FeatureCard>
        <FeatureCard href="/duas" lang={lang}>{t.duas}</FeatureCard>
        <FeatureCard href="/qibla" lang={lang}>{t.qibla}</FeatureCard>
        <FeatureCard href="/stories" lang={lang}>{t.stories}</FeatureCard>
        <FeatureCard href="/donations" lang={lang}>{t.donations}</FeatureCard>

      </div>
    </main>
  );
}

function FeatureCard({
  href,
  lang,
  children,
}: {
  href: string;
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={withLang(href, lang)}
      className="block p-5 border rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {children}
    </Link>
  );
}

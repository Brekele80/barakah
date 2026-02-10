import Link from "next/link";
import Image from "next/image";
import GlobalLanguageSelector from "./components/global-language-selector";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang || "20";

  return (
    <main className="max-w-3xl mx-auto p-6 text-center">

      {/* LOGO */}
      <div className="flex flex-col items-center mb-4">
        <Image
          src="/barakah-logo.png"
          alt="Barakah"
          width={220}
          height={80}
          priority
        />
        <p className="text-gray-500 mt-2">
          Faith. Giving. Guidance.
        </p>
      </div>

      {/* LANGUAGE */}
      <div className="flex justify-center mb-6">
        <GlobalLanguageSelector />
      </div>

      {/* PLACEHOLDER widgets */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-xl p-4">
          Islamic Date loading...
        </div>
        <div className="border rounded-xl p-4">
          Prayer times loading...
        </div>
      </div>

      {/* COUNTDOWN */}
      <div className="border rounded-xl p-4 mb-8">
        Countdown loading...
      </div>

      {/* FEATURES */}
      <div className="grid gap-4">

        <FeatureCard href="/quran" lang={lang}>
          The Holy Qur&apos;an
        </FeatureCard>

        <FeatureCard href="/hadith" lang={lang}>
          Hadith
        </FeatureCard>

        <FeatureCard href="/zakat" lang={lang}>
          Zakat Calculator
        </FeatureCard>

        <FeatureCard href="/tafsir" lang={lang}>
          Tafsir
        </FeatureCard>

        <FeatureCard href="/duas" lang={lang}>
          Duas
        </FeatureCard>

        <FeatureCard href="/qibla" lang={lang}>
          Qibla
        </FeatureCard>

        <FeatureCard href="/stories" lang={lang}>
          Stories of the Prophets
        </FeatureCard>

        <FeatureCard href="/donations" lang={lang}>
          Donations
        </FeatureCard>

      </div>
    </main>
  );
}

function FeatureCard({
  href,
  children,
  lang,
}: {
  href: string;
  children: React.ReactNode;
  lang: string;
}) {
  return (
    <Link
      href={`${href}?lang=${lang}`}
      className="block p-5 border rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {children}
    </Link>
  );
}

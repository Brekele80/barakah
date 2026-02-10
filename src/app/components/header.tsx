"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalLanguageSelector from "@/app/components/global-language-selector";
import ThemeToggle from "@/app/theme-toggle";
import { useMemo } from "react";

export default function Header() {
  const params = useSearchParams();
  const router = useRouter();

  /**
   * SERVER-SAFE LANGUAGE
   * Never read localStorage during render.
   */
  const urlLang = params.get("lang") || "20";

  /**
   * After hydration, ensure URL matches stored lang
   * WITHOUT using useEffect setState
   */
  useMemo(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("lang");
    if (!stored) return;
    if (stored === urlLang) return;

    const newParams = new URLSearchParams(params.toString());
    newParams.set("lang", stored);

    router.replace(`/?${newParams.toString()}`);
  }, [params, router, urlLang]);

  const lang = urlLang;

  return (
    <header className="flex justify-between items-center mb-6">

      {/* LOGO */}
      <Link href={`/?lang=${lang}`} className="flex items-center">
        <Image
          src="/barakah-logo.png"
          alt="Barakah"
          width={160}
          height={60}
          priority
        />
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <Link href={`/bookmarks?lang=${lang}`} className="text-xl">
          <Bookmark className="w-6 h-6 fill-current" />
        </Link>

        <GlobalLanguageSelector />

        <ThemeToggle />

      </div>
    </header>
  );
}

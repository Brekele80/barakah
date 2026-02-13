"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import GlobalLanguageSelector from "@/app/components/global-language-selector";
import ThemeToggle from "@/app/theme-toggle";
import { useEffect } from "react";

import {
  getLangFromSearchParams,
  syncLangToUrl,
  DEFAULT_LANG,
} from "@/lib/lang";

export default function Header() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // language from URL (SSR safe)
  const lang = getLangFromSearchParams(params);

  /**
   * Sync stored lang → URL after mount
   * - no setState
   * - no render mutation
   * - no hydration mismatch
   */
  useEffect(() => {
    syncLangToUrl(
      params.get("lang"),
      (url) => router.replace(url),
      pathname,
      params
    );
  }, [params, router, pathname]);

  return (
    <header className="flex justify-between items-center mb-6">
      {/* LOGO */}
      <Link href={`/?lang=${lang ?? DEFAULT_LANG}`} className="flex items-center">
        <Image
          src="/barakah-logo.png"
          alt="Barakah"
          width={160}
          height={60}
          className="dark:invert-0 invert"
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

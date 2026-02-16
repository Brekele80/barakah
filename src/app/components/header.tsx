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
  withLang,
  DEFAULT_LANG,
} from "@/lib/lang";

export default function Header() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const lang = getLangFromSearchParams(params);

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
      <Link href={withLang("/", lang ?? DEFAULT_LANG)} className="flex items-center">
        <Image
          src="/barakah-logo.png"
          alt="Barakah"
          width={160}
          height={60}
          style={{ width: "auto", height: "auto" }}
          className="dark:invert-0 invert"
          priority
        />
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link href={withLang("/bookmarks", lang)} className="text-xl">
          <Bookmark className="w-6 h-6 fill-current" />
        </Link>

        <GlobalLanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}

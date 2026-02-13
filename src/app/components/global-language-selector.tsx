"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { persistLang, getLangFromSearchParams, DEFAULT_LANG } from "@/lib/lang";

const languages = [
  { code: "20", label: "English" },
  { code: "33", label: "Bahasa" },
  { code: "31", label: "Türkçe" },
  { code: "85", label: "Français" },
  { code: "97", label: "اردو" },
];

export default function GlobalLanguageSelector() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const currentLang = getLangFromSearchParams(params);

  function changeLang(newLang: string) {
    if (newLang === currentLang) return;

    // persist everywhere
    persistLang(newLang);

    // build new url
    const newParams = new URLSearchParams(params.toString());
    newParams.set("lang", newLang);

    router.replace(`${pathname}?${newParams.toString()}`);
  }

  return (
    <select
      value={currentLang ?? DEFAULT_LANG}
      onChange={(e) => changeLang(e.target.value)}
      className="border rounded-lg px-2 py-1 bg-white dark:bg-black"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

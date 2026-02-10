"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getStoredLang } from "@/lib/lang";

const langs = [
  { id: "20", name: "English" },
  { id: "33", name: "Bahasa Indonesia" },
  { id: "31", name: "Türkçe" },
  { id: "85", name: "Français" },
  { id: "97", name: "اردو" },
];

export default function GlobalLanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlLang = searchParams.get("lang");
  const currentLang = urlLang ?? getStoredLang();

  function changeLanguage(newLang: string) {
    localStorage.setItem("lang", newLang);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={currentLang}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded p-2 bg-white text-black dark:bg-gray-900 dark:text-white"
    >
      {langs.map((l) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
}

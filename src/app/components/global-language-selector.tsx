"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getStoredLang, setStoredLang } from "@/lib/storage";

const langs = [
  { id: "20", name: "English" },
  { id: "33", name: "Bahasa Indonesia" },
  { id: "31", name: "Türkçe" },
  { id: "85", name: "Français" },
  { id: "97", name: "اردو" },
];

export default function GlobalLanguageSelector() {
  const router = useRouter();
  const params = useSearchParams();

  const urlLang = params.get("lang");
  const currentLang = urlLang ?? getStoredLang();

  function changeLanguage(newLang: string) {
    setStoredLang(newLang);

    const newParams = new URLSearchParams(params.toString());
    newParams.set("lang", newLang);

    router.push(`/?${newParams.toString()}`);
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

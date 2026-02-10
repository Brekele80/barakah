"use client";

import { useSearchParams, useRouter } from "next/navigation";

const langs = [
  { id: "20", name: "English" },
  { id: "33", name: "Bahasa Indonesia" },
  { id: "31", name: "Türkçe" },
  { id: "85", name: "Français" },
  { id: "97", name: "اردو" },
];

export default function GlobalLanguageSelector() {
  const params = useSearchParams();
  const router = useRouter();

  const current = params.get("lang") || "20";

  function changeLang(newLang: string) {
    localStorage.setItem("lang", newLang);

    const newParams = new URLSearchParams(params.toString());
    newParams.set("lang", newLang);

    router.push(`/?${newParams.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => changeLang(e.target.value)}
      className="border rounded p-2 bg-white dark:bg-gray-900"
    >
      {langs.map((l) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
}

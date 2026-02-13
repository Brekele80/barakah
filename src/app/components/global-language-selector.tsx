"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const langs = [
  { id: "20", name: "UK" },
  { id: "33", name: "ID" },
  { id: "31", name: "TR" },
  { id: "85", name: "FR" },
  { id: "97", name: "UR" },
];

export default function GlobalLanguageSelector() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = params.get("lang") || "20";

  function changeLang(newLang: string) {
    // persist
    localStorage.setItem("lang", newLang);

    // update query
    const newParams = new URLSearchParams(params.toString());
    newParams.set("lang", newLang);

    // stay on SAME PAGE
    router.push(`${pathname}?${newParams.toString()}`);
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

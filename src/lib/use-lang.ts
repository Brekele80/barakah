"use client";

import { useSearchParams } from "next/navigation";
import { resolveLang, persistLang } from "./lang";

export function useLang() {
  const params = useSearchParams();
  const urlLang = params.get("lang");

  const lang = resolveLang(urlLang);

  function setLang(langValue: string) {
    persistLang(langValue);
  }

  return { lang, setLang };
}

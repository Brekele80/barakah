"use client";

import { useEffect } from "react";

export default function ScrollToAyah() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return true;
      }
      return false;
    };

    // try immediately
    if (tryScroll()) return;

    // try again after render
    setTimeout(tryScroll, 400);
  }, []);

  return null;
}

export function getStoredLang(): string {
  if (typeof window === "undefined") return "20";
  return localStorage.getItem("lang") ?? "20";
}

export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  timeout = 8000,
  retries = 1
): Promise<T | null> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    console.warn("Offline — skipping fetch:", url);
    return null;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json: unknown = await res.json();
      return json as T;
    } catch (err) {
      if (attempt === retries) {
        console.error("Fetch failed:", url, err);
        return null;
      }
    }
  }

  return null;
}

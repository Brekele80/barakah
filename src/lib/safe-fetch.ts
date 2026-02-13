export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.warn("Fetch failed:", url);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn("Fetch error:", url, err);
    return null;
  }
}

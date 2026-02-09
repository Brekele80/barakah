"use client";

export default function LanguageSelector({
  currentLang,
  id,
}: {
  currentLang: string;
  id: string;
}) {
  const langs = [
    { id: "20", name: "English" },
    { id: "33", name: "Indonesian" },
    { id: "31", name: "Turkish" },
    { id: "85", name: "French" },
    { id: "97", name: "Urdu" },
  ];

  return (
    <div className="mb-4">
      <select
        value={currentLang}
        onChange={(e) =>
          (window.location.href = `/surah/${id}?lang=${e.target.value}`)
        }
        className="border p-2 rounded bg-white dark:bg-black"
      >
        {langs.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import Link from "next/link";

type Item = {
  id: string;
  title: string;
};

type Props = {
  items: Item[];
  lang: string;
  onSelect?: () => void;
};

export default function SearchSuggestions({ items, lang, onSelect }: Props) {
  if (!items.length) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border rounded-xl mt-2 shadow-lg z-50">
      {items.slice(0, 5).map((item) => (
        <Link
          key={`${item.id}-suggest`}
          href={`/hadith/${item.id}?lang=${lang}`}
          onClick={onSelect}
          className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <div className="text-sm line-clamp-2">{item.title}</div>
        </Link>
      ))}
    </div>
  );
}

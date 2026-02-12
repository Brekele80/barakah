"use client";

type Props = {
  page: number;
  total: number;
  onChange: (p: number) => void;
};

export default function PaginationArrows({ page, total, onChange }: Props) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 pt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        ←
      </button>

      <div className="text-sm">
        {page} / {total}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}

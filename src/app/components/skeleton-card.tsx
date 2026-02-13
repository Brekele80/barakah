export default function SkeletonCard() {
  return (
    <div className="border rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3" />
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded" />
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded" />
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-2/3" />
    </div>
  );
}

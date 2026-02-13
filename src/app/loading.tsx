export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded" />
        <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded" />
        <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded" />
      </div>
    </div>
  );
}

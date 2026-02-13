import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>

      <Link
        href="/"
        className="underline text-blue-500"
      >
        Go home
      </Link>
    </div>
  );
}

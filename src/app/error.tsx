"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP ERROR:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full border rounded-2xl p-6 text-center space-y-4">
            <h1 className="text-xl font-semibold">Something went wrong</h1>

            <p className="text-gray-500 text-sm">
              Please try again. If the issue continues, refresh the page.
            </p>

            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

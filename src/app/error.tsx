"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // log only in dev
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full border rounded-2xl p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold">Something went wrong</h1>

        <button
          onClick={() => reset()}
          className="px-4 py-2 border rounded-xl"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

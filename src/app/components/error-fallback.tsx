"use client";

export default function ErrorFallback({
  message = "Something went wrong",
}: {
  message?: string;
}) {
  return (
    <div className="border rounded-xl p-6 text-center text-gray-500">
      {message}
    </div>
  );
}

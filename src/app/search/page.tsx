import { Suspense } from "react";
import SearchContent from "./search-content";

export default function SearchPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}

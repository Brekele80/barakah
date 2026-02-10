"use client";

import { Suspense } from "react";
import BookmarksContent from "./bookmarks-content";

export default function BookmarksPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <BookmarksContent />
    </Suspense>
  );
}

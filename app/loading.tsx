"use client";

import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-transparent text-white">
      <LoaderCircle className="h-8 w-8 animate-spin text-blue-400" />
      <p className="text-sm text-gray-400">Fetching latest launches...</p>
    </div>
  );
}

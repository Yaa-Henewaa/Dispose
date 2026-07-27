"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
          router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        }
      }}
      className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2"
    >
      <span aria-hidden className="text-gray-400">
        
      </span>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </form>
  );
}

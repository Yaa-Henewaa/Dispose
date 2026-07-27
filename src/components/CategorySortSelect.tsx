"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, type ChangeEvent } from "react";

interface CategorySortSelectProps {
  slug: string;
  currentSort?: string;
  sub?: string;
}

export default function CategorySortSelect({
  slug,
  currentSort,
  sub,
}: CategorySortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = event.target.value;

    if (sub) {
      params.set("sub", sub);
    } else {
      params.delete("sub");
    }

    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const query = params.toString();
    const href = query ? `/category/${slug}?${query}` : `/category/${slug}`;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <select
      name="sort"
      defaultValue={currentSort ?? "newest"}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
      onChange={handleChange}
      disabled={isPending}
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}

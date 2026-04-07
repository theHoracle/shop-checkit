"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/api/types";
import { buildSearchParams } from "@/lib/utils/buildSearchParams";

export function CategoryFilter({
  categories,
  selectedCategory,
}: {
  categories: Category[];
  selectedCategory: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center justify-between max-w-fit gap-3 rounded-full border border-line bg-surface px-4">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Category
      </span>
      <select
        aria-label="Filter by category"
        className="h-12 bg-transparent text-sm outline-none"
        value={selectedCategory}
        onChange={(event) => {
          const query = buildSearchParams(searchParams, {
            category: event.target.value,
            page: 1,
          });
          router.push(`${pathname}${query ? `?${query}` : ""}`);
        }}
      >
        <option value="">All departments</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}

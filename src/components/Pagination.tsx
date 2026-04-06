import Link from "next/link";
import { buildSearchParams } from "@/lib/utils/buildSearchParams";
import type { RouteSearchParams } from "@/types/api";

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: RouteSearchParams;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex flex-wrap items-center gap-3" aria-label="Pagination">
      {pages.map((page) => {
        const query = buildSearchParams(searchParams, { page });
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={`/products${query ? `?${query}` : ""}`}
            className={
              isActive
                ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white"
                : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-foreground hover:border-accent"
            }
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}

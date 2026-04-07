import { cacheLife } from "next/cache";
import { cache } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ProductGrid } from "@/components/ProductGrid";
import { RatingToggle } from "@/components/RatingToggle";
import { SearchBar } from "@/components/SearchBar";
import { getCatalogPage, getCategories } from "@/lib/api/products";
import { parseSearchState } from "@/lib/utils/searchState";
import type { RouteSearchParams } from "@/types/api";

export const unstable_instant = true;

const getCatalogData = cache(
  async (searchState: ReturnType<typeof parseSearchState>) => {
    "use cache";
    cacheLife("minutes");

    const [catalogPage, categories] = await Promise.all([
      getCatalogPage(searchState),
      getCategories(),
    ]);

    return { catalogPage, categories };
  },
);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RouteSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchState = parseSearchState(resolvedSearchParams);

  const { catalogPage, categories } = await getCatalogData(searchState);

  return (
    <div className="container-shell space-y-10 py-10">
      <section className="surface-ring rounded-[2.5rem] p-8">
        <p className="section-eyebrow">Products</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-copy text-5xl text-foreground">
              Browse the catalog
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Search, refine, and move through shareable URLs without falling
              back to client-side fetching.
            </p>
          </div>
          <p className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
            {catalogPage.total} matching products
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.6fr] lg:items-center">
          <SearchBar defaultValue={searchState.q} />
         <div className="flex items-center gap-4 justify-between lg:justify-end!">
          <CategoryFilter
            categories={categories}
            selectedCategory={searchState.category}
            />
          <RatingToggle active={searchState.rating === "4plus"} />
          </div>
        </div>
      </section>

      {catalogPage.items.length === 0 ? (
        <EmptyState
          heading="No matches for this edit"
          message={`We couldn't find products for "${searchState.q || "your current filters"}". Clear the search or switch departments to widen the cut.`}
          ctaHref="/products"
          ctaLabel="Clear filters"
        />
      ) : (
        <>
          <ProductGrid products={catalogPage.items} />
          <Pagination
            currentPage={catalogPage.page}
            totalPages={catalogPage.totalPages}
            searchParams={resolvedSearchParams}
          />
        </>
      )}
    </div>
  );
}

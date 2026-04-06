import type { RouteSearchParams, SearchState } from "@/types/api";

export function parseSearchState(params: RouteSearchParams): SearchState {
  const page = Number(params.page ?? "1");

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    q: params.q?.trim() ?? "",
    category: params.category?.trim() ?? "",
    rating: params.rating === "4plus" ? "4plus" : "all",
  };
}

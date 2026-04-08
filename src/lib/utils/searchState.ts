import type { RouteSearchParams, SearchState } from "@/types/api";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSearchState(params: RouteSearchParams): SearchState {
  const page = Number(getSearchParamValue(params.page) ?? "1");
  const q = getSearchParamValue(params.q);
  const category = getSearchParamValue(params.category);
  const rating = getSearchParamValue(params.rating);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    q: q?.trim() ?? "",
    category: category?.trim() ?? "",
    rating: rating === "4plus" ? "4plus" : "all",
  };
}

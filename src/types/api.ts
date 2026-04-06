export interface SearchState {
  page: number;
  q: string;
  category: string;
  rating: "all" | "4plus";
}

export interface CatalogPageResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface RouteSearchParams {
  page?: string;
  q?: string;
  category?: string;
  rating?: string;
  redirect?: string;
}

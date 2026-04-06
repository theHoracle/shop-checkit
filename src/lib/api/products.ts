import { cacheLife, cacheTag } from "next/cache";
import type { CatalogPageResult, SearchState } from "@/types/api";
import type { Product, ProductsResponse } from "@/types/product";
import { globalFetch } from "../fetch/globalFetch";
import { Category } from "./types";

const PER_PAGE = 20;
const FILTER_BATCH_SIZE = 100;

function paginate(
  products: Product[],
  page: number,
): CatalogPageResult<Product> {
  const start = (page - 1) * PER_PAGE;
  const items = products.slice(start, start + PER_PAGE);
  const total = products.length;

  return {
    items,
    total,
    page,
    perPage: PER_PAGE,
    totalPages: Math.max(1, Math.ceil(total / PER_PAGE)),
  };
}

function applyFilters(products: Product[], searchState: SearchState) {
  return products.filter((product) => {
    const matchesQuery =
      !searchState.q ||
      product.title.toLowerCase().includes(searchState.q.toLowerCase()) ||
      product.description.toLowerCase().includes(searchState.q.toLowerCase());

    const matchesCategory =
      !searchState.category || product.category === searchState.category;

    const matchesRating =
      searchState.rating !== "4plus" || Number(product.rating) >= 4;

    return matchesQuery && matchesCategory && matchesRating;
  });
}

export async function getProducts(page = 1, limit = PER_PAGE) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const skip = (page - 1) * limit;
  return globalFetch<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}&select=id,title,description,price,thumbnail,category,rating,stock,brand,images`,
    {
      skipAuth: true,
    },
  );
}

export async function getFeaturedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const result = await getProducts(1, 8);
  return result.products.slice(0, 8);
}

export async function getProduct(id: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`product-${id}`);
  cacheTag("products");

  return globalFetch<Product>(`/products/${id}`, { skipAuth: true });
}

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  return globalFetch<Category[]>("/products/categories", { skipAuth: true });
}

export async function getCatalogPage(searchState: SearchState) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("categories");

  if (searchState.q || searchState.category || searchState.rating === "4plus") {
    const products = await resolveFilteredProducts(searchState);
    return paginate(products, searchState.page);
  }

  const response = await getProducts(searchState.page, PER_PAGE);

  return {
    items: response.products,
    total: response.total,
    page: searchState.page,
    perPage: PER_PAGE,
    totalPages: Math.max(1, Math.ceil(response.total / PER_PAGE)),
  };
}

async function resolveFilteredProducts(searchState: SearchState) {
  let products: Product[] = [];

  if (searchState.q && !searchState.category) {
    const response = await globalFetch<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(searchState.q)}&limit=${FILTER_BATCH_SIZE}&skip=0`,
      { skipAuth: true },
    );
    products = response.products;
  } else if (searchState.category && !searchState.q) {
    const response = await globalFetch<ProductsResponse>(
      `/products/category/${encodeURIComponent(searchState.category)}?limit=${FILTER_BATCH_SIZE}&skip=0`,
      { skipAuth: true },
    );
    products = response.products;
  } else {
    const response = await globalFetch<ProductsResponse>(
      `/products?limit=${FILTER_BATCH_SIZE}&skip=0`,
      { skipAuth: true },
    );
    products = response.products;
  }

  return applyFilters(products, searchState);
}

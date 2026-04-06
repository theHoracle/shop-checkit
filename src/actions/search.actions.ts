"use server";

import { redirect } from "next/navigation";
import { buildSearchParams } from "@/lib/utils/buildSearchParams";
import type { SearchState } from "@/types/api";

export async function applySearchStateAction(
  searchState: Partial<SearchState>,
) {
  const params = buildSearchParams({}, searchState);
  redirect(`/products${params ? `?${params}` : ""}`);
}

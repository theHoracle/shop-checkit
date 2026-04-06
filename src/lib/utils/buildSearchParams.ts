import { ReadonlyURLSearchParams } from "next/navigation";

type SearchParamValue = string | number | boolean | null | undefined;

function isSearchParams(
  value: unknown,
): value is URLSearchParams | ReadonlyURLSearchParams {
  return value instanceof URLSearchParams;
}

export function buildSearchParams(
  current:
    | URLSearchParams
    | ReadonlyURLSearchParams
    | Record<string, string | undefined>,
  updates: Record<string, SearchParamValue>,
) {
  let params: URLSearchParams;

  if (isSearchParams(current)) {
    params = new URLSearchParams(current);
  } else {
    params = new URLSearchParams(
      Object.entries(current).flatMap(([key, value]) =>
        value ? [[key, value]] : [],
      ),
    );
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false ||
      value === "all"
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
}
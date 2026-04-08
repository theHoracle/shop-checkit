import type { ReadonlyURLSearchParams } from "next/navigation";

type SearchParamValue = string | number | boolean | null | undefined;
type SearchParamRecord = Record<string, string | string[] | undefined>;

function isSearchParams(
  value: unknown,
): value is URLSearchParams | ReadonlyURLSearchParams {
  return value instanceof URLSearchParams;
}

export function buildSearchParams(
  current: URLSearchParams | ReadonlyURLSearchParams | SearchParamRecord,
  updates: Record<string, SearchParamValue>,
) {
  let params: URLSearchParams;

  if (isSearchParams(current)) {
    params = new URLSearchParams(current);
  } else {
    params = new URLSearchParams(
      Object.entries(current).flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.filter(Boolean).map((entry) => [key, entry])
          : value
            ? [[key, value]]
            : [],
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

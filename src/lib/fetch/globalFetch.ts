import { FetchError, type GlobalFetchOptions } from "@/lib/fetch/types";
import { getAccessToken, getRefreshToken, trySetTokens } from "./tokenStore";

const BASE_URL = process.env.DUMMYJSON_BASE_URL ?? "https://dummyjson.com";

function normalizeBody(body: GlobalFetchOptions["body"]) {
  if (!body) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob
  ) {
    return body;
  }

  return JSON.stringify(body);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 30,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  await trySetTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data as { accessToken: string; refreshToken?: string };
}

export async function globalFetch<T>(
  path: string,
  options: GlobalFetchOptions = {},
): Promise<T> {
  const {
    skipAuth = false,
    _isRetry = false,
    accessTokenOverride,
    headers: incomingHeaders,
    body,
    ...fetchOptions
  } = options;

  const headers = new Headers(incomingHeaders);
  const normalizedBody = normalizeBody(body);

  if (normalizedBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = accessTokenOverride ?? (await getAccessToken());

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
    body: normalizedBody,
  });

  if (response.status === 401 && !_isRetry && !skipAuth) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return globalFetch<T>(path, {
        ...options,
        _isRetry: true,
        accessTokenOverride: refreshed.accessToken,
      });
    }

    throw new FetchError(401, "Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await parseResponse<unknown>(response).catch(() => null);

    throw new FetchError(
      response.status,
      response.statusText || "Request failed",
      errorData,
    );
  }

  return parseResponse<T>(response);
}

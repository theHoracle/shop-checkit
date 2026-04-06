export interface GlobalFetchOptions
  extends Omit<RequestInit, "body" | "cache"> {
  body?: BodyInit | Record<string, unknown> | null;
  skipAuth?: boolean;
  _isRetry?: boolean;
  accessTokenOverride?: string;
}

export class FetchError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.data = data;
  }
}

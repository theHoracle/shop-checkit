export interface Category {
  name: string;
  slug: string;
  url: string;
}

export type CategoryApiValue =
  | string
  | Category
  | {
      name?: unknown;
      slug?: unknown;
      url?: unknown;
    };

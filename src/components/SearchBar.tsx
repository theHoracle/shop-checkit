"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { buildSearchParams } from "@/lib/utils/buildSearchParams";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (debouncedValue === defaultValue) {
      return;
    }

    const query = buildSearchParams(searchParams, {
      q: debouncedValue,
      page: 1,
    });
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }, [debouncedValue, defaultValue, pathname, router, searchParams]);

  return (
    <label className="block" htmlFor="product-search">
      <span className="sr-only">Search products</span>
      <Input
        id="product-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for fragrance, furniture, sneakers..."
      />
    </label>
  );
}

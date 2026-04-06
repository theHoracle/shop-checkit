"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { buildSearchParams } from "@/lib/utils/buildSearchParams";

export function RatingToggle({ active }: { active: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Button
      variant={active ? "primary" : "secondary"}
      size="sm"
      onClick={() => {
        const query = buildSearchParams(searchParams, {
          rating: active ? "all" : "4plus",
          page: 1,
        });
        router.push(`${pathname}${query ? `?${query}` : ""}`);
      }}
    >
      4★ and above
    </Button>
  );
}

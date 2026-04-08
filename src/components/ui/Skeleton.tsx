import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-3xl bg-[color-mix(in_srgb,var(--surface-strong)_70%,white_30%)]",
        className,
      )}
    />
  );
}

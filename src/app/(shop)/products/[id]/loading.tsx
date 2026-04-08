import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="container-shell grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
      <Skeleton className="aspect-square w-full rounded-4xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-4/5" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-8 h-12 w-40" />
      </div>
    </div>
  );
}

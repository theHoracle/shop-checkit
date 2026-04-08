import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  const skeletonKeys = [
    "skeleton-1",
    "skeleton-2",
    "skeleton-3",
    "skeleton-4",
    "skeleton-5",
    "skeleton-6",
  ];

  return (
    <div className="container-shell space-y-8 py-10">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skeletonKeys.map((key) => (
          <div
            key={key}
            className="rounded-4xl border border-line bg-surface p-4"
          >
            <Skeleton className="aspect-[4/4.4] w-full rounded-3xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-4/5" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-6 h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

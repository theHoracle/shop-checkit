import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="container-shell grid min-h-[calc(100vh-7rem)] items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-5">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-16 max-w-2xl" />
        <Skeleton className="h-16 max-w-xl" />
        <Skeleton className="h-5 max-w-2xl" />
        <Skeleton className="h-5 max-w-xl" />
      </section>

      <section className="surface-ring rounded-[2.5rem] p-8">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="mt-4 h-10 w-64" />
        <Skeleton className="mt-3 h-5 w-72" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </section>
    </div>
  );
}

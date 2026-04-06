"use client";

import { Button } from "@/components/ui/Button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-shell py-14">
      <div className="surface-ring rounded-[2rem] p-8">
        <p className="section-eyebrow">Something broke</p>
        <h2 className="display-copy mt-4 text-4xl text-foreground">
          We couldn't load this catalog view.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          {error.message ||
            "The request did not complete cleanly. Try again and the route will re-render."}
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

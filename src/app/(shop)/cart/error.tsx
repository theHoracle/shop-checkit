"use client";

import { Button } from "@/components/ui/Button";

export default function CartError({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell py-14">
      <div className="surface-ring rounded-[2rem] p-8">
        <p className="section-eyebrow">Cart issue</p>
        <h2 className="display-copy mt-4 text-4xl text-foreground">
          Your cart couldn't be refreshed.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          The request may have expired or the cart endpoint may be unavailable.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Reload cart
        </Button>
      </div>
    </div>
  );
}

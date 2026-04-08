"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatPrice";

export function CartDrawer() {
  const { hasHydrated, isOpen, items, setOpen } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <aside
      aria-hidden={!isOpen}
      className="pointer-events-none fixed inset-y-0 right-0 z-30 flex w-full justify-end"
    >
      <button
        aria-label="Close cart drawer overlay"
        className={`absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_18%,transparent)] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
        type="button"
      />
      <div
        className={`surface-ring pointer-events-auto relative flex h-full w-full max-w-md flex-col gap-6 border-l border-line p-6 transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow">Cart</p>
            <h2 className="display-copy text-3xl">Your selection</h2>
          </div>
          <button
            className="rounded-full border border-line px-4 py-2 text-sm"
            onClick={() => setOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto">
          {!hasHydrated ? (
            <div className="rounded-[1.75rem] border border-line bg-surface p-6 text-sm leading-7 text-muted">
              Restoring your saved cart...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-line p-6 text-sm leading-7 text-muted">
              Your cart is quiet right now. Add a product to open the drawer
              with an instant local update.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-line bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity * 1000)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="rounded-[1.75rem] border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(subtotal * 1000)}
            </span>
          </div>
          <Link
            href="/cart"
            className="mt-4 block"
            onClick={() => setOpen(false)}
          >
            <Button className="w-full">Review cart</Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

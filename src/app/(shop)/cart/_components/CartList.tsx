"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatPrice";

export function CartList() {
  const { items, updateQuantity, removeItem, clearCart, hasHydrated, setOpen } =
    useCart();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  if (!hasHydrated) {
    return (
      <div className="rounded-4xl border border-line bg-surface p-8 text-sm leading-7 text-muted">
        Restoring your saved cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-line p-8 text-sm leading-7 text-muted">
        Your cart is empty. Add a product from the listing or detail page and it
        will stay in this browser between visits.
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-line bg-surface p-5"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {formatPrice(item.price * 1000)} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-line px-3 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="surface-ring h-fit rounded-4xl p-6">
        <p className="section-eyebrow">Summary</p>
        <h2 className="display-copy mt-4 text-3xl">Order preview</h2>
        <div className="mt-6 space-y-3 text-sm text-muted">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span>{items.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimated total</span>
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(subtotal * 1000)}
            </span>
          </div>
        </div>
        <Button className="mt-6 w-full" variant="secondary" onClick={clearCart}>
          Clear cart
        </Button>
      </aside>
    </div>
  );
}

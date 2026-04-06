"use client";

import { useEffect, useTransition } from "react";
import {
  removeFromCartAction,
  updateCartItemAction,
} from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Cart } from "@/types/cart";

export function CartList({ initialCart }: { initialCart: Cart | null }) {
  const { items, optimisticQuantity, optimisticRemove, syncCart, setOpen } =
    useCart();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    syncCart(initialCart);
  }, [initialCart, syncCart]);

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-line p-8 text-sm leading-7 text-muted">
        Your cart is empty. Add a product from the listing or detail page and it
        will appear here immediately.
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
                      if (item.quantity === 1) {
                        optimisticRemove(item.id);
                        startTransition(async () => {
                          const cart = await removeFromCartAction(item.id);
                          syncCart(cart);
                        });
                        return;
                      }

                      optimisticQuantity(item.id, item.quantity - 1);
                      startTransition(async () => {
                        const cart = await updateCartItemAction({
                          id: item.id,
                          quantity: item.quantity - 1,
                        });
                        syncCart(cart);
                      });
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
                      optimisticQuantity(item.id, item.quantity + 1);
                      startTransition(async () => {
                        const cart = await updateCartItemAction({
                          id: item.id,
                          quantity: item.quantity + 1,
                        });
                        syncCart(cart);
                      });
                    }}
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    optimisticRemove(item.id);
                    startTransition(async () => {
                      const cart = await removeFromCartAction(item.id);
                      syncCart(cart);
                    });
                  }}
                  disabled={isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="surface-ring h-fit rounded-[2rem] p-6">
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
      </aside>
    </div>
  );
}

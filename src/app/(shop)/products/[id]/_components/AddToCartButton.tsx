"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addToCartAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

export function AddToCartButton({
  product,
}: {
  product: {
    id: number;
    title: string;
    price: number;
    thumbnail?: string;
  };
}) {
  const router = useRouter();
  const { optimisticAdd, syncCart, setOpen } = useCart();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full md:w-auto"
      onClick={() => {
        optimisticAdd(product);
        setOpen(true);

        startTransition(async () => {
          try {
            const cart = await addToCartAction({ id: product.id, quantity: 1 });
            syncCart(cart);
          } catch {
            router.push("/login?redirect=/cart");
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Adding..." : "Add to cart"}
    </Button>
  );
}

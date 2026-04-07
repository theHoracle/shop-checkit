"use client";

import { useState } from "react";
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
  const { addItem, setOpen } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <Button
      className="w-full md:w-auto"
      onClick={() => {
        addItem(product);
        setOpen(true);
        setJustAdded(true);
        window.setTimeout(() => {
          setJustAdded(false);
        }, 1200);
      }}
    >
      {justAdded ? "Added" : "Add to cart"}
    </Button>
  );
}

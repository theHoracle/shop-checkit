"use client";

import { Activity } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";

export function CartDrawerActivity() {
  const { isOpen } = useCart();

  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <CartDrawer />
    </Activity>
  );
}

"use client";

import { create } from "zustand";
import type { Cart, CartStoreItem } from "@/types/cart";

function mapCart(cart: Cart | null) {
  if (!cart) {
    return [];
  }

  return cart.products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    quantity: product.quantity,
    thumbnail: product.thumbnail,
  }));
}

interface CartState {
  items: CartStoreItem[];
  isOpen: boolean;
  syncCart: (cart: Cart | null) => void;
  setOpen: (isOpen: boolean) => void;
  optimisticAdd: (
    item: Omit<CartStoreItem, "quantity">,
    quantity?: number,
  ) => void;
  optimisticRemove: (productId: number) => void;
  optimisticQuantity: (productId: number, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  syncCart: (cart) => set({ items: mapCart(cart) }),
  setOpen: (isOpen) => set({ isOpen }),
  optimisticAdd: (item, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return {
          isOpen: true,
          items: state.items.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          ),
        };
      }

      return {
        isOpen: true,
        items: [...state.items, { ...item, quantity }],
      };
    }),
  optimisticRemove: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  optimisticQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    })),
}));

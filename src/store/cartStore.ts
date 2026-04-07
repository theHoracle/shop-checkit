"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStoreItem } from "@/types/cart";

interface CartState {
  items: CartStoreItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  setOpen: (isOpen: boolean) => void;
  markHydrated: () => void;
  addItem: (item: Omit<CartStoreItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      setOpen: (isOpen) => set({ isOpen }),
      markHydrated: () => set({ hasHydrated: true }),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.id === item.id,
          );

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
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "shop-checkit-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

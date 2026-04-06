"use server";

import { updateTag } from "next/cache";
import {
  createCart,
  deleteCart,
  getUserCart,
  updateCart,
} from "@/lib/api/cart";
import { getSessionUser } from "@/lib/fetch/tokenStore";
import type { Cart, CartMutationPayload } from "@/types/cart";

function buildPayload(
  userId: number,
  products: Array<{ id: number; quantity: number }>,
): CartMutationPayload {
  return {
    userId,
    products,
  };
}

async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Sign in to manage your cart.");
  }

  return user;
}

async function mutateCart(
  payload: CartMutationPayload,
  existingCart: Cart | null,
) {
  if (existingCart) {
    if (payload.products.length === 0) {
      await deleteCart(existingCart.id);
      return null;
    }

    return updateCart(existingCart.id, payload);
  }

  return createCart(payload);
}

export async function addToCartAction(input: {
  id: number;
  quantity?: number;
}) {
  const user = await requireUser();
  const quantity = input.quantity ?? 1;
  const existingCart = await getUserCart(user.id);
  const existingItem = existingCart?.products.find(
    (product) => product.id === input.id,
  );

  const products = existingCart
    ? existingCart.products.map((product) =>
        product.id === input.id
          ? { id: product.id, quantity: product.quantity + quantity }
          : { id: product.id, quantity: product.quantity },
      )
    : [];

  if (!existingItem) {
    products.push({ id: input.id, quantity });
  }

  const cart = await mutateCart(buildPayload(user.id, products), existingCart);
  updateTag(`cart-user-${user.id}`);

  return cart;
}

export async function removeFromCartAction(productId: number) {
  const user = await requireUser();
  const existingCart = await getUserCart(user.id);

  if (!existingCart) {
    return null;
  }

  const products = existingCart.products
    .filter((product) => product.id !== productId)
    .map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

  const cart = await mutateCart(buildPayload(user.id, products), existingCart);
  updateTag(`cart-user-${user.id}`);

  return cart;
}

export async function updateCartItemAction(input: {
  id: number;
  quantity: number;
}) {
  const user = await requireUser();
  const existingCart = await getUserCart(user.id);

  if (!existingCart) {
    return null;
  }

  const products = existingCart.products
    .map((product) =>
      product.id === input.id
        ? { id: product.id, quantity: input.quantity }
        : { id: product.id, quantity: product.quantity },
    )
    .filter((product) => product.quantity > 0);

  const cart = await mutateCart(buildPayload(user.id, products), existingCart);
  updateTag(`cart-user-${user.id}`);

  return cart;
}

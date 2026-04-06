import { globalFetch } from "@/lib/fetch/globalFetch";
import type { Cart, CartMutationPayload, CartResponse } from "@/types/cart";

export async function getUserCart(userId: number) {
  const response = await globalFetch<CartResponse>(`/carts/user/${userId}`);
  return response.carts[0] ?? null;
}

export async function createCart(payload: CartMutationPayload) {
  return globalFetch<Cart>("/carts", {
    method: "POST",
    body: payload,
  });
}

export async function updateCart(cartId: number, payload: CartMutationPayload) {
  return globalFetch<Cart>(`/carts/${cartId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteCart(cartId: number) {
  return globalFetch<Cart>(`/carts/${cartId}`, {
    method: "DELETE",
  });
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal?: number;
  discountPercentage?: number;
  thumbnail?: string;
}

export interface Cart {
  id: number;
  userId: number;
  total: number;
  discountedTotal?: number;
  totalProducts: number;
  totalQuantity: number;
  products: CartProduct[];
}

export interface CartResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartMutationPayload {
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface CartStoreItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  category?: string;
  thumbnail?: string;
}

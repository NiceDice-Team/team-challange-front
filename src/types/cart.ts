import { Product } from './product';

export interface GuestCartCreateResponse {
  token: string;
}

export interface GuestCartItemResponse {
  id: number;
  quantity: number;
  product_details: Product;
  attrs?: string;
  metadata?: string;
  [key: string]: unknown;
}

export function mapGuestCartItemToCartItem(
  apiItem: GuestCartItemResponse,
): CartItem {
  return {
    id: String(apiItem.id),
    product: apiItem.product_details,
    quantity: apiItem.quantity,
  };
}

export type AuthCartItemResponse = GuestCartItemResponse & {
  product?: Product;
};

export function parseCartListResponse(response: unknown): AuthCartItemResponse[] {
  if (Array.isArray(response)) {
    return response as AuthCartItemResponse[];
  }

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (Array.isArray(record.results)) {
      return record.results as AuthCartItemResponse[];
    }

    if (Array.isArray(record.items)) {
      return record.items as AuthCartItemResponse[];
    }
  }

  return [];
}

export function mapAuthCartItemToCartItem(
  apiItem: AuthCartItemResponse,
): CartItem | null {
  const product = apiItem.product ?? apiItem.product_details;

  if (!product || typeof product !== "object") {
    return null;
  }

  return {
    id: String(apiItem.id),
    product,
    quantity: apiItem.quantity,
  };
}

export function parseAuthCartItems(response: unknown): CartItem[] {
  return parseCartListResponse(response)
    .map(mapAuthCartItemToCartItem)
    .filter((item): item is CartItem => item !== null);
}

export function mapAuthCartItemResponse(response: unknown): CartItem | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  return mapAuthCartItemToCartItem(response as AuthCartItemResponse);
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Mutation variable types for React Query hooks
export interface AddToCartVariables {
  productId: number | string;
  quantity?: number;
  productData?: Product | null;
}

export interface UpdateCartQuantityVariables {
  cartItemId: string;
  quantity: number;
}

// Context type for optimistic updates rollback
export interface CartMutationContext {
  previousCart: CartItem[] | undefined;
}

// Return type for useCartSummary hook
export interface CartSummary {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  isEmpty: boolean;
}

export interface CartContextValue {
  cartItems: CartItem[];
  cartItemCount: number;
  isLoading: boolean;
  loadCartItems: () => Promise<void>;
  addToCartOptimistic: (
    productId: string | number,
    quantity?: number,
    productData?: Product | null
  ) => Promise<void>;
  updateQuantityOptimistic: (
    cartItemId: string,
    newQuantity: number
  ) => Promise<void>;
  removeItemOptimistic: (cartItemId: string) => Promise<void>;
}

export interface AddToCartResponse {
  success: boolean;
  error?: string;
}

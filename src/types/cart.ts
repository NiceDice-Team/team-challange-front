import { Product } from './product';

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

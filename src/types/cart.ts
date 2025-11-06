export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  description?: string;
  brand?: string;
  categories?: string[];
  audiences?: string[];
  types?: string[];
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
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

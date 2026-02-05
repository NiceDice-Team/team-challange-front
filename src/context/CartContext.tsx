"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useOptimisticCart } from "@/hooks/useOptimisticCart";
import { CartContextValue, AddToCartResponse } from "@/types/cart";
import { Product } from "@/types/product";

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Cart provider component that manages cart state and operations
 */
export function CartProvider({ children }: CartProviderProps): React.ReactElement {
  const cartMethods = useOptimisticCart();

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => cartMethods,
    [
      cartMethods.cartItems,
      cartMethods.cartItemCount,
      cartMethods.isLoading,
      cartMethods.loadCartItems,
      cartMethods.addToCartOptimistic,
      cartMethods.updateQuantityOptimistic,
      cartMethods.removeItemOptimistic,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

/**
 * Hook to access cart context
 * @throws Error if used outside of CartProvider
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

/**
 * Hook specifically for add-to-cart functionality in product components
 */
export function useAddToCart(): {
  addToCart: (product: Product, quantity?: number) => Promise<AddToCartResponse>;
} {
  const { addToCartOptimistic } = useCart();

  const addToCart = async (
    product: Product,
    quantity: number = 1
  ): Promise<AddToCartResponse> => {
    try {
      await addToCartOptimistic(product.id, quantity, product);
      return { success: true };
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add product to cart. Please try again.",
      };
    }
  };

  return { addToCart };
}

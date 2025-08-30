'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useOptimisticCart } from '@/hooks/useOptimisticCart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const cartMethods = useOptimisticCart();

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => cartMethods, [
    cartMethods.cartItems,
    cartMethods.cartItemCount,
    cartMethods.isLoading,
    cartMethods.loadCartItems,
    cartMethods.addToCartOptimistic,
    cartMethods.updateQuantityOptimistic,
    cartMethods.removeItemOptimistic
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Hook specifically for add-to-cart functionality in product components
export function useAddToCart() {
  const { addToCartOptimistic } = useCart();
  
  const addToCart = async (product, quantity = 1) => {
    try {
      await addToCartOptimistic(product.id, quantity, product);
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to add product to cart. Please try again.' 
      };
    }
  };

  return { addToCart };
}
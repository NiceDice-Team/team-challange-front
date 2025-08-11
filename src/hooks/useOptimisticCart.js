'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cartServices } from '@/services/cartServices';

// Custom hook for optimistic cart updates with debouncing
export function useOptimisticCart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce timers for different operations
  const addToCartTimeouts = useRef(new Map());
  const updateQuantityTimeouts = useRef(new Map());
  
  // Load initial cart data
  const loadCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await cartServices.getCartItems();
      setCartItems(items);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalCount);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimistic add to cart with debouncing
  const addToCartOptimistic = useCallback(async (productId, quantity = 1, productData = null) => {
    // Clear existing timeout for this product
    const existingTimeout = addToCartTimeouts.current.get(productId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Optimistically update the UI immediately
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item (if we have product data)
        if (productData) {
          const newItem = {
            id: `optimistic_${productId}_${Date.now()}`,
            product: productData,
            quantity: quantity
          };
          return [...prevItems, newItem];
        }
        return prevItems;
      }
    });

    // Update count optimistically
    setCartItemCount(prev => prev + quantity);

    // Debounce the actual API call (300ms delay)
    const timeoutId = setTimeout(async () => {
      try {
        await cartServices.addToCart(productId, quantity);
        
        // Refresh cart data to sync with server
        await loadCartItems();
        
        // Clean up timeout reference
        addToCartTimeouts.current.delete(productId);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        
        // Revert optimistic update on error
        setCartItems(prevItems => {
          const itemIndex = prevItems.findIndex(item => item.product.id === productId);
          if (itemIndex >= 0) {
            const updatedItems = [...prevItems];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: Math.max(0, updatedItems[itemIndex].quantity - quantity)
            };
            return updatedItems.filter(item => item.quantity > 0);
          }
          return prevItems;
        });
        
        setCartItemCount(prev => Math.max(0, prev - quantity));
        
        // Show error message
        throw error;
      }
    }, 300);

    addToCartTimeouts.current.set(productId, timeoutId);
  }, [loadCartItems]);

  // Optimistic quantity update with debouncing
  const updateQuantityOptimistic = useCallback(async (cartItemId, newQuantity) => {
    // Find the current item
    const currentItem = cartItems.find(item => item.id === cartItemId);
    if (!currentItem) return;

    const quantityDiff = newQuantity - currentItem.quantity;

    // Clear existing timeout for this item
    const existingTimeout = updateQuantityTimeouts.current.get(cartItemId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Optimistically update the UI
    if (newQuantity <= 0) {
      // Remove item
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    } else {
      // Update quantity
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
    
    setCartItemCount(prev => prev + quantityDiff);

    // Debounce the actual API call (500ms delay for updates)
    const timeoutId = setTimeout(async () => {
      try {
        if (newQuantity <= 0) {
          await cartServices.removeFromCart(cartItemId);
        } else {
          await cartServices.updateCartItem(cartItemId, newQuantity);
        }
        
        // Refresh cart data to sync with server
        await loadCartItems();
        
        // Clean up timeout reference
        updateQuantityTimeouts.current.delete(cartItemId);
      } catch (error) {
        console.error('Failed to update cart:', error);
        
        // Revert optimistic update on error
        if (newQuantity <= 0) {
          // Restore the item
          setCartItems(prevItems => [...prevItems, currentItem]);
        } else {
          // Revert quantity change
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === cartItemId
                ? { ...item, quantity: currentItem.quantity }
                : item
            )
          );
        }
        
        setCartItemCount(prev => prev - quantityDiff);
        
        throw error;
      }
    }, 500);

    updateQuantityTimeouts.current.set(cartItemId, timeoutId);
  }, [cartItems, loadCartItems]);

  // Remove item (with optimistic update)
  const removeItemOptimistic = useCallback(async (cartItemId) => {
    const currentItem = cartItems.find(item => item.id === cartItemId);
    if (!currentItem) return;

    // Optimistically remove the item
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    setCartItemCount(prev => Math.max(0, prev - currentItem.quantity));

    try {
      await cartServices.removeFromCart(cartItemId);
      await loadCartItems(); // Sync with server
    } catch (error) {
      console.error('Failed to remove item:', error);
      
      // Revert optimistic update
      setCartItems(prevItems => [...prevItems, currentItem]);
      setCartItemCount(prev => prev + currentItem.quantity);
      
      throw error;
    }
  }, [cartItems, loadCartItems]);

  // Initial load
  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    const addTimeouts = addToCartTimeouts.current;
    const updateTimeouts = updateQuantityTimeouts.current;
    
    return () => {
      // Clear all timeouts
      addTimeouts.forEach(timeout => clearTimeout(timeout));
      updateTimeouts.forEach(timeout => clearTimeout(timeout));
      addTimeouts.clear();
      updateTimeouts.clear();
    };
  }, []);

  return {
    cartItems,
    cartItemCount,
    isLoading,
    loadCartItems,
    addToCartOptimistic,
    updateQuantityOptimistic,
    removeItemOptimistic
  };
}
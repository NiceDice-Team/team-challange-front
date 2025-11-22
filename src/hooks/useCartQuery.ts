'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartServices } from '@/services/cartServices';
import type {
  CartItem,
  AddToCartVariables,
  UpdateCartQuantityVariables,
  CartMutationContext,
  CartSummary,
} from '@/types/cart';

const CART_QUERY_KEY = ['cart'] as const;

export function useCartQuery() {
  return useQuery<CartItem[]>({
    queryKey: CART_QUERY_KEY,
    queryFn: cartServices.getCartItems,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, AddToCartVariables, CartMutationContext>({
    mutationFn: ({ productId, quantity = 1 }: AddToCartVariables) =>
      cartServices.addToCart(productId, quantity),

    onMutate: async ({ productId, quantity = 1, productData }: AddToCartVariables) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY);

      queryClient.setQueryData<CartItem[]>(CART_QUERY_KEY, (oldCart = []) => {
        const existingItemIndex = oldCart.findIndex(
          (item) => item.product?.id === productId
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...oldCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
          };
          return updatedCart;
        }

        if (productData) {
          return [
            ...oldCart,
            {
              id: `temp_${productId}_${Date.now()}`,
              product: productData,
              quantity,
            },
          ];
        }

        return oldCart;
      });

      return { previousCart };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      console.error('Failed to add to cart:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateCartQuantityVariables, CartMutationContext>({
    mutationFn: ({ cartItemId, quantity }: UpdateCartQuantityVariables) =>
      cartServices.updateCartItem(cartItemId, quantity),

    onMutate: async ({ cartItemId, quantity }: UpdateCartQuantityVariables) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY);

      queryClient.setQueryData<CartItem[]>(CART_QUERY_KEY, (oldCart = []) => {
        return quantity <= 0
          ? oldCart.filter((item) => item.id !== cartItemId)
          : oldCart.map((item) =>
              item.id === cartItemId ? { ...item, quantity } : item
            );
      });

      return { previousCart };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      console.error('Failed to update cart quantity:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string, CartMutationContext>({
    mutationFn: (cartItemId: string) => cartServices.removeFromCart(cartItemId),

    onMutate: async (cartItemId: string) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY);

      queryClient.setQueryData<CartItem[]>(CART_QUERY_KEY, (oldCart = []) =>
        oldCart.filter((item) => item.id !== cartItemId)
      );

      return { previousCart };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      console.error('Failed to remove item:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useCartSummary(): CartSummary {
  const { data: cartItems = [] } = useCartQuery();

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      typeof item.product?.price === 'string'
        ? parseFloat(item.product.price)
        : (item.product?.price ?? 0);
    return sum + price * item.quantity;
  }, 0);

  return {
    cartItems,
    itemCount,
    subtotal,
    isEmpty: cartItems.length === 0,
  };
}
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddToCart, useUpdateCartQuantity } from '@/hooks/useCartQuery';
import { cartServices } from '@/services/cartServices';
import { showCustomToast } from '@/components/shared/Toast';
import type { Product } from '@/types/product';
import type { CartItem } from '@/types/cart';

jest.mock('@/services/cartServices', () => ({
  cartServices: {
    getCartItems: jest.fn(),
    addToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeFromCart: jest.fn(),
  },
}));

jest.mock('@/components/shared/Toast', () => ({
  showCustomToast: jest.fn(),
}));

const mockedCartServices = cartServices as jest.Mocked<typeof cartServices>;
const mockedShowCustomToast = showCustomToast as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  };
};

describe('useAddToCart', () => {
  const product = {
    id: 1,
    name: 'Catan',
    price: '49.99',
    stock: '10',
    stars: 4,
    images: [],
    reviews: [],
  } as Product;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows success toast with product name after adding item to cart', async () => {
    mockedCartServices.addToCart.mockResolvedValue({ success: true });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useAddToCart(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product,
      });
    });

    await waitFor(() => {
      expect(mockedShowCustomToast).toHaveBeenCalledWith({
        title: 'Catan',
        description: 'Added to cart',
        duration: 3000,
      });
    });
  });

  test('shows error toast instead of success toast when add to cart fails', async () => {
    mockedCartServices.addToCart.mockRejectedValue(new Error('Request failed'));

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useAddToCart(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product,
      })
    ).rejects.toThrow('Request failed');

    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Catan',
      description: 'Request failed',
    });
  });

  test('shows error toast with stock validation message when add to cart fails', async () => {
    mockedCartServices.addToCart.mockRejectedValue(
      new Error('Only 2 units available in stock.')
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useAddToCart(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product,
      })
    ).rejects.toThrow('Only 2 units available in stock.');

    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Catan',
      description: 'Only 2 units available in stock.',
    });
  });
});

describe('useUpdateCartQuantity', () => {
  const cartItem: CartItem = {
    id: 'cart-item-1',
    quantity: 2,
    product: {
      id: 1,
      name: 'Catan',
      price: '49.99',
      stock: '2',
      images: [],
      reviews: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows error toast with product name when quantity update exceeds stock', async () => {
    mockedCartServices.updateCartItem.mockRejectedValue(
      new Error('Only 2 units available in stock.')
    );

    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(['cart'], [cartItem]);

    const { result } = renderHook(() => useUpdateCartQuantity(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        cartItemId: cartItem.id,
        quantity: 3,
      })
    ).rejects.toThrow('Only 2 units available in stock.');

    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Catan',
      description: 'Only 2 units available in stock.',
    });
  });
});

import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddToCart } from '@/hooks/useCartQuery';
import { cartServices } from '@/services/cartServices';
import { showCustomToast } from '@/components/shared/Toast';
import type { Product } from '@/types/product';

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

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useAddToCart', () => {
  const product = {
    id: 1,
    name: 'Catan',
    price: '49.99',
    stock: '10',
    stars: '4',
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

    const { result } = renderHook(() => useAddToCart(), {
      wrapper: createWrapper(),
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

  test('does not show success toast when add to cart fails', async () => {
    mockedCartServices.addToCart.mockRejectedValue(new Error('Request failed'));

    const { result } = renderHook(() => useAddToCart(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product,
      })
    ).rejects.toThrow('Request failed');

    expect(mockedShowCustomToast).not.toHaveBeenCalled();
  });
});

import { cartServices, productServices } from '../../services/cartServices';
import { fetchAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  fetchAPI: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock tokenManager
jest.mock('@/lib/tokenManager', () => ({
  getTokens: jest.fn(() => ({ accessToken: 'mock-token' })),
}));

// Mock console.error to avoid test output noise
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('cartServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('getCartItems', () => {
    test('returns authenticated user cart items', async () => {
      const mockCartItems = [
        { id: 1, product: { id: 1, name: 'Product 1' }, quantity: 2 },
        { id: 2, product: { id: 2, name: 'Product 2' }, quantity: 1 },
      ];

      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockResolvedValue({ results: mockCartItems });

      const result = await cartServices.getCartItems();

      expect(fetchAPI).toHaveBeenCalledWith('carts/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
      expect(result).toEqual(mockCartItems);
    });

    test('returns guest cart items when not authenticated', async () => {
      const mockGuestCart = [
        { id: 'guest_1', product: { id: 1 }, quantity: 1 },
      ];

      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') return JSON.stringify(mockGuestCart);
        return null;
      });

      fetchAPI.mockResolvedValue({ id: 1, name: 'Product 1', price: 10.99 });

      const result = await cartServices.getCartItems();

      expect(result).toHaveLength(1);
      expect(result[0].product).toEqual({ id: 1, name: 'Product 1', price: 10.99 });
    });

    test('handles API error gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockRejectedValue(new Error('API Error'));

      const result = await cartServices.getCartItems();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching cart items:', expect.any(Error));
    });

    test('handles guest cart localStorage error', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') throw new Error('localStorage error');
        return null;
      });

      const result = await cartServices.getCartItems();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error reading guest cart:', expect.any(Error));
    });
  });

  describe('addToCart', () => {
    test('adds item to authenticated user cart', async () => {
      const mockResponse = { id: 1, product: { id: 1 }, quantity: 2 };

      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockResolvedValue(mockResponse);

      const result = await cartServices.addToCart(1, 2);

      expect(fetchAPI).toHaveBeenCalledWith('carts/', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
        },
        body: {
          product: 1,
          quantity: 2,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test('adds item to guest cart when not authenticated', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') return '[]';
        return null;
      });

      const result = await cartServices.addToCart(1, 2);

      expect(result.success).toBe(true);
      expect(result.cart).toHaveLength(1);
      expect(result.cart[0].product.id).toBe(1);
      expect(result.cart[0].quantity).toBe(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'guest_cart',
        expect.stringContaining('"quantity":2')
      );
    });

    test('updates existing item quantity in guest cart', async () => {
      const existingCart = [
        { id: 'guest_1', product: { id: 1 }, quantity: 1 },
      ];

      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') return JSON.stringify(existingCart);
        return null;
      });

      const result = await cartServices.addToCart(1, 2);

      expect(result.success).toBe(true);
      expect(result.cart[0].quantity).toBe(3); // 1 + 2
    });

    test('handles authenticated cart API error', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockRejectedValue(new Error('API Error'));

      await expect(cartServices.addToCart(1, 2)).rejects.toThrow('API Error');
      expect(console.error).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error));
    });
  });

  describe('updateCartItem', () => {
    test('updates authenticated user cart item', async () => {
      const mockResponse = { id: 1, product: { id: 1 }, quantity: 3 };

      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockResolvedValue(mockResponse);

      const result = await cartServices.updateCartItem(1, 3);

      expect(fetchAPI).toHaveBeenCalledWith('carts/1/', {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer mock-token',
        },
        body: { quantity: 3 },
      });
      expect(result).toEqual(mockResponse);
    });

    test('updates guest cart item', async () => {
      const existingCart = [
        { id: 'guest_1_123', product: { id: 1 }, quantity: 2 },
      ];

      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') return JSON.stringify(existingCart);
        return null;
      });

      const result = await cartServices.updateCartItem('guest_1_123', 5);

      expect(result.success).toBe(true);
      expect(result.cart[0].quantity).toBe(5);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'guest_cart',
        expect.stringContaining('"quantity":5')
      );
    });

    test('handles update API error', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockRejectedValue(new Error('Update API Error'));

      await expect(cartServices.updateCartItem(1, 3)).rejects.toThrow('Update API Error');
    });
  });

  describe('removeFromCart', () => {
    test('removes item from authenticated user cart', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockResolvedValue();

      const result = await cartServices.removeFromCart(1);

      expect(fetchAPI).toHaveBeenCalledWith('carts/1/', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
      expect(result).toBe(true);
    });

    test('removes item from guest cart', async () => {
      const existingCart = [
        { id: 'guest_1_123', product: { id: 1 }, quantity: 2 },
        { id: 'guest_2_456', product: { id: 2 }, quantity: 1 },
      ];

      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'guest_cart') return JSON.stringify(existingCart);
        return null;
      });

      const result = await cartServices.removeFromCart('guest_1_123');

      expect(result).toBe(true);
      
      // Verify localStorage.setItem was called with the updated cart
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'guest_cart',
        JSON.stringify([{ id: 'guest_2_456', product: { id: 2 }, quantity: 1 }])
      );
    });

    test('handles remove API error', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      fetchAPI.mockRejectedValue(new Error('Delete API Error'));

      await expect(cartServices.removeFromCart(1)).rejects.toThrow('Delete API Error');
    });
  });
});

describe('productServices (from cartServices)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProductById', () => {
    test('fetches product by ID successfully', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 19.99 };
      fetchAPI.mockResolvedValue(mockProduct);

      const result = await productServices.getProductById(1);

      expect(fetchAPI).toHaveBeenCalledWith('products/1/');
      expect(result).toEqual(mockProduct);
    });

    test('handles product fetch error', async () => {
      fetchAPI.mockRejectedValue(new Error('Product not found'));

      await expect(productServices.getProductById(1)).rejects.toThrow('Product not found');
      expect(console.error).toHaveBeenCalledWith('Error fetching product 1:', expect.any(Error));
    });
  });

  describe('getRandomProducts', () => {
    test('returns random selection of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
        { id: 4, name: 'Product 4' },
        { id: 5, name: 'Product 5' },
      ];

      fetchAPI.mockResolvedValue({ results: mockProducts });

      const result = await productServices.getRandomProducts(3);

      expect(fetchAPI).toHaveBeenCalledWith('products/?limit=20&ordering=-created_at');
      expect(result).toHaveLength(3);
      expect(result.every(p => mockProducts.some(mp => mp.id === p.id))).toBe(true);
    });

    test('handles random products error', async () => {
      fetchAPI.mockRejectedValue(new Error('API Error'));

      const result = await productServices.getRandomProducts();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching random products:', expect.any(Error));
    });
  });

  describe('getProducts', () => {
    test('fetches products with filters', async () => {
      const mockProducts = [{ id: 1, name: 'Filtered Product' }];
      fetchAPI.mockResolvedValue({ results: mockProducts });

      const params = {
        search: 'dice',
        brand: 'test-brand',
        categories: 'category1',
        ordering: 'name',
        limit: 10,
        offset: 0,
      };

      const result = await productServices.getProducts(params);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('products/?search=dice&brand=test-brand&categories=category1&ordering=name&limit=10&offset=0')
      );
      expect(result).toEqual(mockProducts);
    });

    test('fetches products without filters', async () => {
      const mockProducts = [{ id: 1, name: 'All Products' }];
      fetchAPI.mockResolvedValue({ results: mockProducts });

      const result = await productServices.getProducts();

      expect(fetchAPI).toHaveBeenCalledWith('products/?');
      expect(result).toEqual(mockProducts);
    });

    test('handles products fetch error', async () => {
      fetchAPI.mockRejectedValue(new Error('Products API Error'));

      const result = await productServices.getProducts();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
    });
  });
});
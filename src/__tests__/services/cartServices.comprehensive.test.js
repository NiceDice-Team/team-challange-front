import { cartServices, productServices, ensureGuestCart, deleteGuestCart } from '../../services/cartServices';
import { fetchAPI } from '../../services/api';
import { getValidAccessToken, isAuthenticated } from '@/lib/tokenManager';

jest.mock('../../services/api', () => ({
  fetchAPI: jest.fn(),
  API_URL: 'https://api.test/',
}));

jest.mock('@/lib/tokenManager', () => ({
  getTokens: jest.fn(() => ({ accessToken: 'mock-token' })),
  getValidAccessToken: jest.fn(),
  isAuthenticated: jest.fn(),
}));

const guestStoreState = {
  token: null,
  items: [],
  setToken: jest.fn((token) => {
    guestStoreState.token = token;
  }),
  setItems: jest.fn((items) => {
    guestStoreState.items = items;
  }),
  upsertItem: jest.fn((item) => {
    const index = guestStoreState.items.findIndex(
      (existing) => existing.product?.id === item.product?.id,
    );
    if (index >= 0) {
      guestStoreState.items = [
        ...guestStoreState.items.slice(0, index),
        item,
        ...guestStoreState.items.slice(index + 1),
      ];
      return;
    }
    guestStoreState.items = [...guestStoreState.items, item];
  }),
  removeItemByProductId: jest.fn((productId) => {
    guestStoreState.items = guestStoreState.items.filter(
      (item) => item.product?.id !== productId,
    );
  }),
  clearGuestCart: jest.fn(() => {
    guestStoreState.token = null;
    guestStoreState.items = [];
  }),
};

jest.mock('@/store/guestCart', () => ({
  getGuestToken: jest.fn(() => guestStoreState.token),
  useGuestCartStore: {
    getState: jest.fn(() => guestStoreState),
  },
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockGuestApiItem = (overrides = {}) => ({
  id: 42,
  quantity: 2,
  product_details: {
    id: 1,
    name: 'Product 1',
    price: 10.99,
    stock: 10,
  },
  ...overrides,
});

function mockFetchResponse({ ok = true, status = 200, body = null } = {}) {
  return {
    ok,
    status,
    text: jest.fn().mockResolvedValue(body ? JSON.stringify(body) : ''),
    json: jest.fn().mockResolvedValue(body),
  };
}

describe('cartServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    guestStoreState.token = null;
    guestStoreState.items = [];
    getValidAccessToken.mockResolvedValue('mock-token');
    isAuthenticated.mockReturnValue(false);
    global.fetch = jest.fn();
  });

  describe('ensureGuestCart', () => {
    test('creates guest cart token when missing', async () => {
      fetchAPI.mockResolvedValue({ token: 'guest-token-123' });

      await ensureGuestCart();

      expect(fetchAPI).toHaveBeenCalledWith('cart/guest/', {
        method: 'POST',
        body: { email: '', phone: '' },
      });
      expect(guestStoreState.setToken).toHaveBeenCalledWith('guest-token-123');
    });

    test('does not recreate token when already present', async () => {
      guestStoreState.token = 'existing-token';

      await ensureGuestCart();

      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe('getCartItems', () => {
    test('returns authenticated user cart items', async () => {
      const mockCartItems = [
        { id: 1, product: { id: 1, name: 'Product 1' }, quantity: 2 },
        { id: 2, product: { id: 2, name: 'Product 2' }, quantity: 1 },
      ];

      isAuthenticated.mockReturnValue(true);
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

    test('returns guest cart items from API with X-Guest-Token', async () => {
      guestStoreState.token = 'guest-token';
      const apiItems = [mockGuestApiItem()];

      global.fetch.mockResolvedValue(
        mockFetchResponse({ body: apiItems }),
      );

      const result = await cartServices.getCartItems();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/cart/guest/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Guest-Token': 'guest-token',
          }),
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('42');
      expect(result[0].product.name).toBe('Product 1');
      expect(guestStoreState.setItems).toHaveBeenCalled();
    });

    test('falls back to guest store items when GET fails', async () => {
      guestStoreState.token = 'guest-token';
      guestStoreState.items = [
        { id: '7', product: { id: 3, name: 'Cached', stock: 5 }, quantity: 1 },
      ];

      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue(''),
        json: jest.fn().mockRejectedValue(new Error('not json')),
      });

      const result = await cartServices.getCartItems();

      expect(result).toEqual(guestStoreState.items);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching guest cart items:',
        expect.any(Error),
      );
    });

    test('handles authenticated API error gracefully', async () => {
      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockRejectedValue(new Error('API Error'));

      const result = await cartServices.getCartItems();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching cart items:',
        expect.any(Error),
      );
    });
  });

  describe('addToCart', () => {
    test('adds item to authenticated user cart', async () => {
      const mockResponse = { id: 1, product: { id: 1 }, quantity: 2 };

      isAuthenticated.mockReturnValue(true);
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

    test('adds item to guest cart via API with X-Guest-Token', async () => {
      guestStoreState.token = 'guest-token';
      const apiItem = mockGuestApiItem();

      fetchAPI.mockImplementation((endpoint) => {
        if (endpoint === 'products/1/') {
          return Promise.resolve({ id: 1, name: 'Product 1', stock: 10 });
        }
        return Promise.resolve({});
      });

      global.fetch.mockImplementation((url, options = {}) => {
        if (url.includes('cart/guest/item/') && options.method === 'POST') {
          return Promise.resolve(mockFetchResponse({ body: apiItem }));
        }
        return Promise.resolve(mockFetchResponse({ body: [] }));
      });

      const result = await cartServices.addToCart(1, 2);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/cart/guest/item/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Guest-Token': 'guest-token',
          }),
          body: JSON.stringify({
            product_id: 1,
            quantity: 2,
            attrs: '',
            metadata: '',
          }),
        }),
      );
      expect(result.id).toBe('42');
      expect(guestStoreState.upsertItem).toHaveBeenCalled();
    });

    test('handles authenticated cart API error', async () => {
      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockRejectedValue(new Error('API Error'));

      await expect(cartServices.addToCart(1, 2)).rejects.toThrow('API Error');
      expect(console.error).toHaveBeenCalledWith(
        'Error adding to cart:',
        expect.any(Error),
      );
    });

    test('prevents adding more items than available stock', async () => {
      isAuthenticated.mockReturnValue(true);

      fetchAPI.mockImplementation((endpoint) => {
        if (endpoint === 'products/1/') {
          return Promise.resolve({ id: 1, name: 'Product 1', stock: 3 });
        }

        if (endpoint === 'carts/') {
          return Promise.resolve({
            results: [
              {
                id: 10,
                product: { id: 1, name: 'Product 1', stock: 3 },
                quantity: 3,
              },
            ],
          });
        }

        return Promise.resolve({});
      });

      await expect(cartServices.addToCart(1, 1)).rejects.toThrow(
        'Only 3 units available in stock.',
      );

      expect(
        fetchAPI.mock.calls.some(
          ([endpoint, options]) =>
            endpoint === 'carts/' && options?.method === 'POST',
        ),
      ).toBe(false);
    });
  });

  describe('updateCartItem', () => {
    test('updates authenticated user cart item', async () => {
      const mockResponse = { id: 1, product: { id: 1 }, quantity: 3 };

      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockResolvedValue(mockResponse);

      const result = await cartServices.updateCartItem('1', 3);

      expect(fetchAPI).toHaveBeenCalledWith('carts/1/', {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer mock-token',
        },
        body: { quantity: 3 },
      });
      expect(result).toEqual(mockResponse);
    });

    test('updates guest cart item via PATCH with product_id', async () => {
      guestStoreState.token = 'guest-token';
      guestStoreState.items = [
        { id: '42', product: { id: 1, name: 'Product 1', stock: 10 }, quantity: 2 },
      ];
      const apiItem = mockGuestApiItem({ quantity: 5 });

      global.fetch.mockImplementation((url, options = {}) => {
        if (url.includes('cart/guest/item/') && options.method === 'PATCH') {
          return Promise.resolve(mockFetchResponse({ body: apiItem }));
        }
        return Promise.resolve(
          mockFetchResponse({ body: [mockGuestApiItem()] }),
        );
      });

      const result = await cartServices.updateCartItem('42', 5);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/cart/guest/item/',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'X-Guest-Token': 'guest-token',
          }),
          body: JSON.stringify({ product_id: 1, quantity: 5 }),
        }),
      );
      expect(result.quantity).toBe(5);
    });

    test('handles update API error', async () => {
      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockRejectedValue(new Error('Update API Error'));

      await expect(cartServices.updateCartItem('1', 3)).rejects.toThrow(
        'Update API Error',
      );
    });

    test('prevents updating cart quantity beyond available stock', async () => {
      isAuthenticated.mockReturnValue(true);

      fetchAPI.mockResolvedValue({
        results: [
          { id: '1', product: { id: 1, name: 'Product 1', stock: 2 }, quantity: 2 },
        ],
      });

      await expect(cartServices.updateCartItem('1', 3)).rejects.toThrow(
        'Only 2 units available in stock.',
      );

      expect(
        fetchAPI.mock.calls.some(
          ([endpoint, options]) =>
            endpoint === 'carts/1/' && options?.method === 'PATCH',
        ),
      ).toBe(false);
    });
  });

  describe('removeFromCart', () => {
    test('removes item from authenticated user cart', async () => {
      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockResolvedValue({});

      const result = await cartServices.removeFromCart('1');

      expect(fetchAPI).toHaveBeenCalledWith('carts/1/', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
      expect(result).toBe(true);
    });

    test('removes item from guest cart with product_id in DELETE body', async () => {
      guestStoreState.token = 'guest-token';
      guestStoreState.items = [
        { id: '42', product: { id: 1, name: 'Product 1', stock: 10 }, quantity: 2 },
        { id: '43', product: { id: 2, name: 'Product 2', stock: 5 }, quantity: 1 },
      ];

      global.fetch.mockResolvedValue(mockFetchResponse());

      const result = await cartServices.removeFromCart('42');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/cart/guest/item/',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'X-Guest-Token': 'guest-token',
          }),
          body: JSON.stringify({ product_id: 1 }),
        }),
      );
      expect(result).toBe(true);
      expect(guestStoreState.removeItemByProductId).toHaveBeenCalledWith(1);
    });

    test('handles remove API error', async () => {
      isAuthenticated.mockReturnValue(true);
      fetchAPI.mockRejectedValue(new Error('Delete API Error'));

      await expect(cartServices.removeFromCart('1')).rejects.toThrow(
        'Delete API Error',
      );
    });
  });

  describe('deleteGuestCart', () => {
    test('deletes guest cart on server and clears store', async () => {
      guestStoreState.token = 'guest-token';
      global.fetch.mockResolvedValue(mockFetchResponse());

      await deleteGuestCart();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/cart/guest/',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'X-Guest-Token': 'guest-token',
          }),
        }),
      );
      expect(guestStoreState.clearGuestCart).toHaveBeenCalled();
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

      await expect(productServices.getProductById(1)).rejects.toThrow(
        'Product not found',
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching product 1:',
        expect.any(Error),
      );
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

      expect(fetchAPI).toHaveBeenCalledWith(
        'products/?limit=20&ordering=-created_at',
      );
      expect(result).toHaveLength(3);
      expect(
        result.every((p) => mockProducts.some((mp) => mp.id === p.id)),
      ).toBe(true);
    });

    test('handles random products error', async () => {
      fetchAPI.mockRejectedValue(new Error('API Error'));

      const result = await productServices.getRandomProducts();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching random products:',
        expect.any(Error),
      );
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
        expect.stringContaining(
          'products/?search=dice&brand=test-brand&categories=category1&ordering=name&limit=10&offset=0',
        ),
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
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching products:',
        expect.any(Error),
      );
    });
  });
});

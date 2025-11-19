import { productServices } from '../../services/productServices';
import { fetchAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  fetchAPI: jest.fn(),
}));

// Mock console.error to avoid test output noise
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('productServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('fetches products with default pagination', async () => {
      const mockProducts = {
        results: [
          { id: 1, name: 'Product 1', price: 10.99 },
          { id: 2, name: 'Product 2', price: 15.99 },
        ],
        count: 2,
      };

      fetchAPI.mockResolvedValue(mockProducts);

      const result = await productServices.getProducts();

      expect(fetchAPI).toHaveBeenCalledWith('products/?offset=0&limit=8', {});
      expect(result).toEqual(mockProducts);
    });

    test('fetches products with custom pagination', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      await productServices.getProducts(2, 12, { headers: { 'Custom': 'header' } });

      expect(fetchAPI).toHaveBeenCalledWith('products/?offset=12&limit=12', { headers: { 'Custom': 'header' } });
    });

    test('calculates offset correctly for different pages', async () => {
      fetchAPI.mockResolvedValue({ results: [], count: 0 });

      // Page 3 with pageSize 10 should have offset 20
      await productServices.getProducts(3, 10);

      expect(fetchAPI).toHaveBeenCalledWith('products/?offset=20&limit=10', {});
    });
  });

  describe('getProductsWithFilters', () => {
    test('applies sorting correctly', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      // Test price high to low
      await productServices.getProductsWithFilters(1, 8, 'price-high-low');
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-price'),
        {}
      );

      // Test price low to high
      await productServices.getProductsWithFilters(1, 8, 'price-low-high');
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('ordering=price'),
        {}
      );

      // Test newest
      await productServices.getProductsWithFilters(1, 8, 'newest');
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-created_at'),
        {}
      );

      // Test bestsellers
      await productServices.getProductsWithFilters(1, 8, 'bestsellers');
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-stars'),
        {}
      );

      // Test relevance (no ordering)
      await productServices.getProductsWithFilters(1, 8, 'relevance');
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.not.stringContaining('ordering='),
        {}
      );
    });

    test('applies category filters', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        categories: ['dice', 'board-games', 'card-games'],
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', filters);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('categories=dice%2Cboard-games%2Ccard-games'),
        {}
      );
    });

    test('applies game type filters', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        gameTypes: ['strategy', 'adventure'],
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', filters);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('types=strategy%2Cadventure'),
        {}
      );
    });

    test('applies audience filters', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        audiences: ['adults', 'kids'],
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', filters);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('audiences=adults%2Ckids'),
        {}
      );
    });

    test('applies brand filter (only first brand)', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        brands: ['wizards-of-the-coast', 'hasbro', 'other-brand'],
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', filters);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('brand=wizards-of-the-coast'),
        {}
      );
      expect(fetchAPI).toHaveBeenCalledWith(
        expect.not.stringContaining('hasbro'),
        {}
      );
    });

    test('applies search filter', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        search: 'dungeons and dragons',
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', filters);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('search=dungeons+and+dragons'),
        {}
      );
    });

    test('combines multiple filters correctly', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = {
        categories: ['dice'],
        gameTypes: ['strategy'],
        audiences: ['adults'],
        brands: ['wizards-of-the-coast'],
        search: 'dnd',
      };

      await productServices.getProductsWithFilters(1, 8, 'price-high-low', filters);

      const expectedCall = fetchAPI.mock.calls[0][0];
      expect(expectedCall).toContain('categories=dice');
      expect(expectedCall).toContain('types=strategy');
      expect(expectedCall).toContain('audiences=adults');
      expect(expectedCall).toContain('brand=wizards-of-the-coast');
      expect(expectedCall).toContain('search=dnd');
      expect(expectedCall).toContain('ordering=-price');
    });

    test('handles pagination with filters', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const filters = { categories: ['dice'] };

      await productServices.getProductsWithFilters(3, 6, 'newest', filters);

      const expectedCall = fetchAPI.mock.calls[0][0];
      expect(expectedCall).toContain('offset=12'); // (3-1) * 6
      expect(expectedCall).toContain('limit=6');
    });

    test('handles empty filters', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      await productServices.getProductsWithFilters(1, 8, 'relevance', {});

      expect(fetchAPI).toHaveBeenCalledWith(
        'products/?offset=0&limit=8',
        {}
      );
    });

    test('handles unknown sort option', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      await productServices.getProductsWithFilters(1, 8, 'unknown-sort');

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.not.stringContaining('ordering='),
        {}
      );
    });

    test('passes through options parameter', async () => {
      const mockProducts = { results: [], count: 0 };
      fetchAPI.mockResolvedValue(mockProducts);

      const customOpts = {
        headers: { 'Authorization': 'Bearer token' },
        signal: new AbortController().signal,
      };

      await productServices.getProductsWithFilters(1, 8, 'relevance', {}, customOpts);

      expect(fetchAPI).toHaveBeenCalledWith(
        expect.any(String),
        customOpts
      );
    });
  });

  describe('getProductById', () => {
    test('fetches single product successfully', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 19.99,
        description: 'A test product',
        images: ['image1.jpg'],
      };

      fetchAPI.mockResolvedValue(mockProduct);

      const result = await productServices.getProductById(1);

      expect(fetchAPI).toHaveBeenCalledWith('products/1/', {});
      expect(result).toEqual(mockProduct);
    });

    test('fetches product with custom options', async () => {
      const mockProduct = { id: 2, name: 'Another Product' };
      fetchAPI.mockResolvedValue(mockProduct);

      const customOpts = {
        headers: { 'Cache-Control': 'no-cache' },
      };

      const result = await productServices.getProductById(2, customOpts);

      expect(fetchAPI).toHaveBeenCalledWith('products/2/', customOpts);
      expect(result).toEqual(mockProduct);
    });

    test('handles product not found error', async () => {
      const error = new Error('Product not found');
      fetchAPI.mockRejectedValue(error);

      await expect(productServices.getProductById(999)).rejects.toThrow('Product not found');
      
      expect(console.error).toHaveBeenCalledWith('Error fetching product 999:', error);
    });

    test('handles network error', async () => {
      const networkError = new Error('Network Error');
      fetchAPI.mockRejectedValue(networkError);

      await expect(productServices.getProductById(1)).rejects.toThrow('Network Error');
      
      expect(console.error).toHaveBeenCalledWith('Error fetching product 1:', networkError);
    });

    test('handles string ID parameter', async () => {
      const mockProduct = { id: 123, name: 'String ID Product' };
      fetchAPI.mockResolvedValue(mockProduct);

      await productServices.getProductById('123');

      expect(fetchAPI).toHaveBeenCalledWith('products/123/', {});
    });
  });
});
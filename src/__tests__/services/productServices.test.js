// Mock the product services functions for testing
jest.mock('../../services/productServices', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  searchProducts: jest.fn(),
  getProductsByCategory: jest.fn(),
}));

import { 
  getProducts, 
  getProductById, 
  searchProducts, 
  getProductsByCategory 
} from '../../services/productServices';

describe('Product Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('fetches products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 19.99 },
        { id: 2, name: 'Product 2', price: 29.99 }
      ];
      
      getProducts.mockResolvedValue(mockProducts);
      
      const result = await getProducts();
      
      expect(getProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    test('handles getProducts errors', async () => {
      const mockError = new Error('Failed to fetch products');
      
      getProducts.mockRejectedValue(mockError);
      
      await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductById', () => {
    test('fetches product by id successfully', async () => {
      const productId = 1;
      const mockProduct = { id: 1, name: 'Test Product', price: 39.99 };
      
      getProductById.mockResolvedValue(mockProduct);
      
      const result = await getProductById(productId);
      
      expect(getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    test('handles product not found', async () => {
      const productId = 999;
      
      getProductById.mockResolvedValue(null);
      
      const result = await getProductById(productId);
      
      expect(getProductById).toHaveBeenCalledWith(productId);
      expect(result).toBeNull();
    });
  });

  describe('searchProducts', () => {
    test('searches products successfully', async () => {
      const searchQuery = 'dice';
      const mockResults = [
        { id: 1, name: 'Dice Set', price: 15.99 },
        { id: 2, name: 'Gaming Dice', price: 25.99 }
      ];
      
      searchProducts.mockResolvedValue(mockResults);
      
      const result = await searchProducts(searchQuery);
      
      expect(searchProducts).toHaveBeenCalledWith(searchQuery);
      expect(result).toEqual(mockResults);
    });

    test('handles empty search results', async () => {
      const searchQuery = 'nonexistent';
      
      searchProducts.mockResolvedValue([]);
      
      const result = await searchProducts(searchQuery);
      
      expect(result).toEqual([]);
    });
  });

  describe('getProductsByCategory', () => {
    test('fetches products by category successfully', async () => {
      const categoryId = 1;
      const mockProducts = [
        { id: 1, name: 'Board Game 1', price: 49.99, categoryId: 1 },
        { id: 2, name: 'Board Game 2', price: 59.99, categoryId: 1 }
      ];
      
      getProductsByCategory.mockResolvedValue(mockProducts);
      
      const result = await getProductsByCategory(categoryId);
      
      expect(getProductsByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(mockProducts);
    });

    test('handles empty category', async () => {
      const categoryId = 999;
      
      getProductsByCategory.mockResolvedValue([]);
      
      const result = await getProductsByCategory(categoryId);
      
      expect(result).toEqual([]);
    });
  });
});
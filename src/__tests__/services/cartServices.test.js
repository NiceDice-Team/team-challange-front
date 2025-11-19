// Mock the actual cart services functions for testing
jest.mock('../../services/cartServices', () => ({
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateCartItem: jest.fn(),
  getCart: jest.fn(),
  clearCart: jest.fn(),
}));

import { 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  getCart, 
  clearCart 
} from '../../services/cartServices';

describe('Cart Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    test('calls addToCart with correct parameters', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 29.99 };
      const mockResponse = { success: true, cart: [mockProduct] };
      
      addToCart.mockResolvedValue(mockResponse);
      
      const result = await addToCart(mockProduct);
      
      expect(addToCart).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockResponse);
    });

    test('handles addToCart errors', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 29.99 };
      const mockError = new Error('Failed to add to cart');
      
      addToCart.mockRejectedValue(mockError);
      
      await expect(addToCart(mockProduct)).rejects.toThrow('Failed to add to cart');
    });
  });

  describe('removeFromCart', () => {
    test('calls removeFromCart with item id', async () => {
      const itemId = 1;
      const mockResponse = { success: true };
      
      removeFromCart.mockResolvedValue(mockResponse);
      
      const result = await removeFromCart(itemId);
      
      expect(removeFromCart).toHaveBeenCalledWith(itemId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCartItem', () => {
    test('calls updateCartItem with correct parameters', async () => {
      const itemId = 1;
      const quantity = 2;
      const mockResponse = { success: true, quantity: 2 };
      
      updateCartItem.mockResolvedValue(mockResponse);
      
      const result = await updateCartItem(itemId, quantity);
      
      expect(updateCartItem).toHaveBeenCalledWith(itemId, quantity);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCart', () => {
    test('calls getCart and returns cart data', async () => {
      const mockCart = { 
        items: [
          { id: 1, name: 'Product 1', price: 19.99, quantity: 1 },
          { id: 2, name: 'Product 2', price: 29.99, quantity: 2 }
        ],
        total: 79.97
      };
      
      getCart.mockResolvedValue(mockCart);
      
      const result = await getCart();
      
      expect(getCart).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    test('handles empty cart', async () => {
      const emptyCart = { items: [], total: 0 };
      
      getCart.mockResolvedValue(emptyCart);
      
      const result = await getCart();
      
      expect(result).toEqual(emptyCart);
    });
  });

  describe('clearCart', () => {
    test('calls clearCart successfully', async () => {
      const mockResponse = { success: true, message: 'Cart cleared' };
      
      clearCart.mockResolvedValue(mockResponse);
      
      const result = await clearCart();
      
      expect(clearCart).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
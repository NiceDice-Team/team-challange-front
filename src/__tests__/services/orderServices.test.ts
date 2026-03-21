import { orderServices } from '../../services/orderServices';
import { fetchAPI } from '../../services/api';
import { getTokens } from '@/lib/tokenManager';

// Mock the dependencies
jest.mock('../../services/api');
jest.mock('@/lib/tokenManager');

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;
const mockGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;

describe('Order Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock getTokens to return a token
    mockGetTokens.mockReturnValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  });

  describe('getOrders', () => {
    test('fetches orders successfully with userId', async () => {
      const mockOrders = {
        results: [
          { id: 1, status: 'completed', total: 99.99 },
          { id: 2, status: 'pending', total: 149.99 },
        ],
      };

      mockFetchAPI.mockResolvedValue(mockOrders);

      const result = await orderServices.getOrders('user123');

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/?user_id=user123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });
      expect(result).toEqual(mockOrders.results);
    });

    test('handles response without results property', async () => {
      const mockOrders = [
        { id: 1, status: 'completed', total: 99.99 },
        { id: 2, status: 'pending', total: 149.99 },
      ];

      mockFetchAPI.mockResolvedValue(mockOrders);

      const result = await orderServices.getOrders('user123');

      expect(result).toEqual(mockOrders);
    });

    test('throws error when userId is not provided', async () => {
      await expect(orderServices.getOrders(null)).rejects.toThrow(
        'User must be authenticated to fetch orders'
      );

      await expect(orderServices.getOrders(undefined)).rejects.toThrow(
        'User must be authenticated to fetch orders'
      );

      await expect(orderServices.getOrders('')).rejects.toThrow(
        'User must be authenticated to fetch orders'
      );

      expect(mockFetchAPI).not.toHaveBeenCalled();
    });

    test('handles API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockFetchAPI.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(orderServices.getOrders('user123')).rejects.toThrow('API Error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching orders:', mockError);
      expect(mockFetchAPI).toHaveBeenCalledWith('orders/?user_id=user123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });

      consoleSpy.mockRestore();
    });

    test('includes authorization header with access token', async () => {
      const customToken = 'custom-access-token';
      mockGetTokens.mockReturnValue({
        accessToken: customToken,
        refreshToken: 'refresh-token',
      });

      mockFetchAPI.mockResolvedValue({ results: [] });

      await orderServices.getOrders('user123');

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/?user_id=user123', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customToken}`,
        },
      });
    });

    test('handles network errors', async () => {
      const networkError = new Error('Network request failed');
      mockFetchAPI.mockRejectedValue(networkError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(orderServices.getOrders('user123')).rejects.toThrow('Network request failed');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching orders:', networkError);

      consoleSpy.mockRestore();
    });

    test('constructs correct URL with userId', async () => {
      mockFetchAPI.mockResolvedValue({ results: [] });

      await orderServices.getOrders('user456');

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/?user_id=user456', expect.any(Object));
    });
  });

  describe('getDeliveryOptions', () => {
    test('fetches and normalizes delivery options successfully', async () => {
      const mockDeliveryOptions = [
        {
          id: 1,
          name: 'Самовивіз',
          description: 'Самостійний вивіз з магазину',
          price: '0.00',
          estimated_days: 0,
        },
        {
          id: 2,
          name: 'Нова Пошта',
          description: 'Доставка Новою Поштою',
          price: '150.00',
          estimated_days: 2,
        },
      ];

      mockFetchAPI.mockResolvedValue(mockDeliveryOptions);

      const result = await orderServices.getDeliveryOptions();

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/delivery-options/', {
        method: 'GET',
      });
      expect(result).toEqual([
        {
          id: 1,
          name: 'Самовивіз',
          description: 'Самостійний вивіз з магазину',
          price: 0,
          estimatedDays: 0,
        },
        {
          id: 2,
          name: 'Нова Пошта',
          description: 'Доставка Новою Поштою',
          price: 150,
          estimatedDays: 2,
        },
      ]);
    });

    test('passes abort signal when provided', async () => {
      const signal = new AbortController().signal;
      mockFetchAPI.mockResolvedValue([]);

      await orderServices.getDeliveryOptions(signal);

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/delivery-options/', {
        method: 'GET',
        signal,
      });
    });

    test('handles API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockFetchAPI.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(orderServices.getDeliveryOptions()).rejects.toThrow('API Error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching delivery options:', mockError);

      consoleSpy.mockRestore();
    });
  });
});

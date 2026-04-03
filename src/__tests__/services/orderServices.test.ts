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
      mockFetchAPI.mockResolvedValue({
        results: [
          {
            id: 1,
            name: 'DHL',
            price: '35.00',
            description: '1-3 business days',
            estimated_days: 3,
          },
        ],
      });

      const result = await orderServices.getDeliveryOptions();

      expect(mockFetchAPI).toHaveBeenCalledWith('orders/delivery-options/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });
      expect(result).toEqual([
        {
          id: 1,
          name: 'DHL',
          price: 35,
          description: '1-3 business days (3 days)',
        },
      ]);
    });

    test('handles array responses without results wrapper', async () => {
      mockFetchAPI.mockResolvedValue([
        {
          id: 2,
          name: 'Nova poshta',
          price: '20.00',
          description: '3-5 business days',
          estimated_days: 4,
        },
      ]);

      const result = await orderServices.getDeliveryOptions();

      expect(result).toEqual([
        {
          id: 2,
          name: 'Nova poshta',
          price: 20,
          description: '3-5 business days (4 days)',
        },
      ]);
    });
  });
});

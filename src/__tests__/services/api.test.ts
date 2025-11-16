import { fetchAPI, API_URL } from '../../services/api';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the API config
jest.mock('../../config/api', () => ({
  API_BASE_URL: 'https://api.example.com',
}));

describe('API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchAPI', () => {
    test('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test Product' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchAPI('/products/1');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/products/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: null,
          cache: 'no-store',
        })
      );
      
      expect(result).toEqual(mockData);
    });

    test('makes successful POST request with body', async () => {
      const mockResponse = { id: 1, message: 'Created' };
      const postData = { name: 'New Product', price: 29.99 };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await fetchAPI('/products', {
        method: 'POST',
        body: postData,
      });
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/products',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles custom headers', async () => {
      const mockData = { success: true };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await fetchAPI('/protected', {
        headers: {
          Authorization: 'Bearer token123',
          'X-Custom-Header': 'value',
        },
      });
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/protected',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
            'X-Custom-Header': 'value',
          }),
        })
      );
    });

    test('handles HTTP error responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(fetchAPI('/not-found')).rejects.toThrow('API Error! status: 404');
    });

    test('handles API error responses with error details', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          errors: [
            { detail: 'Invalid request data' }
          ]
        }),
      });

      await expect(fetchAPI('/invalid')).rejects.toThrow('Invalid request data');
    });

    test('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchAPI('/products')).rejects.toThrow('Network error');
    });

    test('handles different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
      
      for (const method of methods) {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

        await fetchAPI('/test', { method });
        
        expect(fetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({
            method,
          })
        );
      }
    });

    test('handles request with signal for cancellation', async () => {
      const controller = new AbortController();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await fetchAPI('/cancellable', { signal: controller.signal });
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/cancellable',
        expect.objectContaining({
          signal: controller.signal,
        })
      );
    });

    test('handles empty response body', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

      const result = await fetchAPI('/empty');
      expect(result).toBeNull();
    });

    test('uses correct API_URL constant', () => {
      expect(API_URL).toBe('https://api.example.com');
    });
  });
});
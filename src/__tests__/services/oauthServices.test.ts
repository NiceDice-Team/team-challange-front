import { sendOAuthToken } from '../../services/oauthServices';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the API config
jest.mock('../../config/api', () => ({
  API_BASE_URL: 'https://api.example.com',
  API_ENDPOINTS: {
    oauth: '/oauth'
  },
  buildApiUrl: (endpoint: string) => `https://api.example.com${endpoint}`,
}));

describe('OAuth Services', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('sendOAuthToken', () => {
    test('sends OAuth token successfully', async () => {
      const mockResponse = {
        access_token: 'oauth_access_token',
        refresh_token: 'oauth_refresh_token',
        user: { id: 1, email: 'user@example.com' }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const provider = {
        provider: 'google' as const,
        token: 'google_oauth_token_123'
      };

      const result = await sendOAuthToken(provider);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/oauth',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'google',
            access_token: 'google_oauth_token_123',
          }),
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles OAuth authentication with Facebook provider', async () => {
      const mockResponse = {
        access_token: 'fb_access_token',
        refresh_token: 'fb_refresh_token',
        user: { id: 2, email: 'user@facebook.com' }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const provider = {
        provider: 'facebook' as const,
        token: 'facebook_oauth_token_456'
      };

      const result = await sendOAuthToken(provider);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/oauth',
        expect.objectContaining({
          body: JSON.stringify({
            provider: 'facebook',
            access_token: 'facebook_oauth_token_456',
          }),
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    test('handles OAuth authentication failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          detail: 'Invalid OAuth token'
        }),
      });

      const provider = {
        provider: 'google' as const,
        token: 'invalid_token'
      };

      await expect(sendOAuthToken(provider)).rejects.toThrow('Invalid OAuth token');
    });

    test('handles OAuth authentication failure without detail', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const provider = {
        provider: 'google' as const,
        token: 'some_token'
      };

      await expect(sendOAuthToken(provider)).rejects.toThrow('OAuth authentication failed');
    });

    test('handles network errors during OAuth', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network connection failed'));

      const provider = {
        provider: 'google' as const,
        token: 'network_test_token'
      };

      await expect(sendOAuthToken(provider)).rejects.toThrow('Network connection failed');
    });

    test('sends correct request format', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const provider = {
        provider: 'google' as const,
        token: 'format_test_token'
      };

      await sendOAuthToken(provider);
      
      const [url, options] = (fetch as jest.Mock).mock.calls[0];
      
      expect(url).toBe('https://api.example.com/oauth');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      
      const requestBody = JSON.parse(options.body);
      expect(requestBody).toEqual({
        provider: 'google',
        access_token: 'format_test_token',
      });
    });

    test('handles empty response body', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => null,
      });

      const provider = {
        provider: 'google' as const,
        token: 'empty_response_token'
      };

      const result = await sendOAuthToken(provider);
      expect(result).toBeNull();
    });
  });
});
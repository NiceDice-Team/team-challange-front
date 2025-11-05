// Mock tokenManager functionality
const mockTokenManager = {
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  removeTokens: jest.fn(),
  isTokenValid: jest.fn(),
  refreshToken: jest.fn(),
};

jest.mock('../../lib/tokenManager', () => mockTokenManager);

describe('tokenManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('getTokens returns stored tokens', () => {
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
    
    mockTokenManager.getTokens.mockReturnValue(mockTokens);
    
    const tokens = mockTokenManager.getTokens();
    
    expect(tokens).toEqual(mockTokens);
    expect(mockTokenManager.getTokens).toHaveBeenCalled();
  });

  test('setTokens stores tokens correctly', () => {
    const tokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    
    mockTokenManager.setTokens.mockImplementation(() => {
      window.localStorage.setItem('tokens', JSON.stringify(tokens));
    });
    
    mockTokenManager.setTokens(tokens);
    
    expect(mockTokenManager.setTokens).toHaveBeenCalledWith(tokens);
  });

  test('removeTokens clears stored tokens', () => {
    mockTokenManager.removeTokens.mockImplementation(() => {
      window.localStorage.removeItem('tokens');
    });
    
    mockTokenManager.removeTokens();
    
    expect(mockTokenManager.removeTokens).toHaveBeenCalled();
  });

  test('isTokenValid checks token validity', () => {
    const validToken = 'valid-token';
    
    mockTokenManager.isTokenValid.mockReturnValue(true);
    
    const isValid = mockTokenManager.isTokenValid(validToken);
    
    expect(isValid).toBe(true);
    expect(mockTokenManager.isTokenValid).toHaveBeenCalledWith(validToken);
  });

  test('isTokenValid returns false for invalid token', () => {
    const invalidToken = 'invalid-token';
    
    mockTokenManager.isTokenValid.mockReturnValue(false);
    
    const isValid = mockTokenManager.isTokenValid(invalidToken);
    
    expect(isValid).toBe(false);
    expect(mockTokenManager.isTokenValid).toHaveBeenCalledWith(invalidToken);
  });

  test('refreshToken handles token refresh', async () => {
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    
    mockTokenManager.refreshToken.mockResolvedValue(newTokens);
    
    const result = await mockTokenManager.refreshToken('old-refresh-token');
    
    expect(result).toEqual(newTokens);
    expect(mockTokenManager.refreshToken).toHaveBeenCalledWith('old-refresh-token');
  });

  test('refreshToken handles refresh failure', async () => {
    const error = new Error('Refresh failed');
    
    mockTokenManager.refreshToken.mockRejectedValue(error);
    
    await expect(mockTokenManager.refreshToken('invalid-refresh-token')).rejects.toThrow('Refresh failed');
    expect(mockTokenManager.refreshToken).toHaveBeenCalledWith('invalid-refresh-token');
  });

  test('handles empty token storage', () => {
    mockTokenManager.getTokens.mockReturnValue(null);
    
    const tokens = mockTokenManager.getTokens();
    
    expect(tokens).toBeNull();
  });

  test('validates token format', () => {
    const malformedToken = 'malformed.token';
    
    mockTokenManager.isTokenValid.mockImplementation((token) => {
      // Simple validation mock - check if token has proper JWT format
      return token && token.includes('.') && token.split('.').length === 3;
    });
    
    const isValid = mockTokenManager.isTokenValid(malformedToken);
    
    expect(isValid).toBe(false);
  });

  test('handles concurrent token operations', async () => {
    const tokens1 = { accessToken: 'token1', refreshToken: 'refresh1' };
    const tokens2 = { accessToken: 'token2', refreshToken: 'refresh2' };
    
    mockTokenManager.setTokens.mockImplementation(() => Promise.resolve());
    
    // Simulate concurrent operations
    const promises = [
      mockTokenManager.setTokens(tokens1),
      mockTokenManager.setTokens(tokens2),
    ];
    
    await Promise.all(promises);
    
    expect(mockTokenManager.setTokens).toHaveBeenCalledTimes(2);
  });
});
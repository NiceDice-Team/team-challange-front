import {
  isNoCacheRoute,
  mergeNoCacheHeaders,
  NO_CACHE_REQUEST_HEADERS,
  shouldAttachNoCacheHeaders,
} from '@/lib/noCacheHeaders';
import { isAuthenticated } from '@/lib/tokenManager';

jest.mock('@/lib/tokenManager', () => ({
  isAuthenticated: jest.fn(),
}));

const mockIsAuthenticated = isAuthenticated as jest.MockedFunction<
  typeof isAuthenticated
>;

describe('noCacheHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
  });

  test('detects no-cache routes', () => {
    expect(isNoCacheRoute('/login')).toBe(true);
    expect(isNoCacheRoute('/profile/orders')).toBe(true);
    expect(isNoCacheRoute('/register')).toBe(true);
    expect(isNoCacheRoute('/catalog')).toBe(false);
  });

  test('attaches headers for authenticated users', () => {
    mockIsAuthenticated.mockReturnValue(true);

    expect(shouldAttachNoCacheHeaders()).toBe(true);
    expect(
      mergeNoCacheHeaders({ 'Content-Type': 'application/json' }),
    ).toEqual({
      'Content-Type': 'application/json',
      ...NO_CACHE_REQUEST_HEADERS,
    });
  });

  test('force option always attaches headers', () => {
    expect(
      mergeNoCacheHeaders(
        { 'Content-Type': 'application/json' },
        { force: true },
      ),
    ).toEqual({
      'Content-Type': 'application/json',
      ...NO_CACHE_REQUEST_HEADERS,
    });
  });
});

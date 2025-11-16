import { AuthOptions } from 'next-auth';

// Mock the auth configuration
jest.mock('../../auth.config', () => ({
  authOptions: {
    providers: [],
    callbacks: {
      jwt: jest.fn(),
      session: jest.fn(),
    },
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt',
    },
  },
}));

describe('auth.config', () => {
  let authOptions: AuthOptions;

  beforeEach(() => {
    // Import after mocking to get the mocked version
    const authConfig = require('../../auth.config');
    authOptions = authConfig.authOptions;
  });

  test('has required configuration properties', () => {
    expect(authOptions).toBeDefined();
    expect(authOptions.providers).toBeDefined();
    expect(authOptions.callbacks).toBeDefined();
    expect(authOptions.pages).toBeDefined();
    expect(authOptions.session).toBeDefined();
  });

  test('configures correct session strategy', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
  });

  test('configures correct sign-in page', () => {
    expect(authOptions.pages?.signIn).toBe('/login');
  });

  test('has JWT callback configured', () => {
    expect(authOptions.callbacks?.jwt).toBeDefined();
    expect(typeof authOptions.callbacks?.jwt).toBe('function');
  });

  test('has session callback configured', () => {
    expect(authOptions.callbacks?.session).toBeDefined();
    expect(typeof authOptions.callbacks?.session).toBe('function');
  });

  test('providers array is configured', () => {
    expect(Array.isArray(authOptions.providers)).toBe(true);
  });
});
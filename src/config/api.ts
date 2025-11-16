/**
 * Centralized configuration for API endpoints and environment variables
 * This ensures consistent fallback values across the entire application
 */

// Types for API configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
  };
}

export interface ApiEndpoints {
  // Auth endpoints
  oauth: string;
  logout: string;
  tokenRefresh: string;
  
  // User endpoints
  signup: string;
  login: string;
  profile: string;
  
  // Product endpoints
  products: string;
  categories: string;
  
  // Cart endpoints
  cart: string;
  
  // Order endpoints
  orders: string;
}

export interface EnvironmentConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  backendUrl: string;
  telemetryDisabled: boolean;
}

export interface ApiConfiguration {
  API_BASE_URL: string;
  API_CONFIG: ApiConfig;
  API_ENDPOINTS: ApiEndpoints;
  buildApiUrl: (endpoint: string) => string;
  ENV_CONFIG: EnvironmentConfig;
}

// Base API URL with fallback
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/';

// API Configuration
export const API_CONFIG: ApiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS: ApiEndpoints = {
  // Auth endpoints
  oauth: 'users/oauth/',
  logout: 'users/logout/',
  tokenRefresh: 'users/token/refresh/',
  
  // User endpoints
  signup: 'users/signup/',
  login: 'users/login/',
  profile: 'users/profile/',
  
  // Product endpoints
  products: 'products/',
  categories: 'categories/',
  
  // Cart endpoints
  cart: 'cart/',
  
  // Order endpoints
  orders: 'orders/',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}${cleanEndpoint}`;
};

// Environment configuration
export const ENV_CONFIG: EnvironmentConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  backendUrl: API_BASE_URL,
  telemetryDisabled: process.env.NEXT_TELEMETRY_DISABLED === '1',
};

// Default export object
const apiConfig: ApiConfiguration = {
  API_BASE_URL,
  API_CONFIG,
  API_ENDPOINTS,
  buildApiUrl,
  ENV_CONFIG,
};

export default apiConfig;
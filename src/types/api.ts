/**
 * Common types for API responses and data structures
 */

// Common API response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
  detail?: string;
}

// Auth-related types
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends ApiResponse<AuthTokens> {
  access?: string;
  refresh?: string;
}

export interface SignupResponse extends ApiResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface OAuthProvider {
  provider: string;
  token: string;
}

export interface OAuthResponse extends ApiResponse<AuthTokens> {
  access?: string;
  refresh?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  is_active?: boolean;
  date_joined?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  in_stock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_category?: string;
}

// Cart types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_price: number;
  created_at: string;
  updated_at: string;
}

// Order types
export interface Order {
  id: string;
  user: string;
  items: CartItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Form state types
export interface FormState {
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
}

export interface LoginFormState extends FormState {
  email?: string;
}

// Environment types
export type NodeEnv = 'development' | 'production' | 'test';

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API request options
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  signal?: AbortSignal;
}
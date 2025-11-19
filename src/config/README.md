# API Configuration (TypeScript)

This directory contains centralized TypeScript configuration for API endpoints and environment variables with full type safety.

## Usage

### Import individual exports (recommended)

```typescript
import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '@/config/api';

// Use the base URL directly
const url: string = `${API_BASE_URL}custom/endpoint/`;

// Use predefined endpoints with type safety
const response = await fetch(buildApiUrl(API_ENDPOINTS.oauth));

// Build custom URLs with validation
const customUrl: string = buildApiUrl('custom/endpoint/');
```

### Import everything

```typescript
import apiConfig from '@/config/api';

const response = await fetch(apiConfig.buildApiUrl(apiConfig.API_ENDPOINTS.login));
```

### Using with typed API calls

```typescript
import { buildApiUrl, API_ENDPOINTS } from '@/config/api';
import { OAuthProvider, OAuthResponse } from '@/types/api';

export const sendOAuthToken = async (provider: OAuthProvider): Promise<OAuthResponse> => {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.oauth), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(provider),
  });
  return response.json();
};
```

## Configuration Files

### `/config/api.ts`

Centralized TypeScript configuration for:
- API base URL with fallback values
- Axios configuration with proper typing
- API endpoints with TypeScript interfaces
- Helper functions with type safety
- Environment configuration

### `/types/api.ts`

TypeScript definitions for:
- API response interfaces
- Authentication types
- User, Product, Cart, and Order interfaces
- Form state types
- HTTP method types

## TypeScript Benefits

1. **Type Safety**: Catch errors at compile time
2. **IntelliSense**: Full autocomplete for endpoints and configurations
3. **Refactoring Safety**: Rename endpoints safely across the entire codebase
4. **Documentation**: Self-documenting code with interface definitions
5. **Consistent API Responses**: Typed responses ensure consistent data handling

## Interface Examples

### API Endpoints Interface

```typescript
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
```

### API Configuration Interface

```typescript
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
  };
}
```

## Migration from JavaScript

When migrating existing JavaScript files:

1. **Rename files**: `.js` → `.ts` (or `.jsx` → `.tsx` for React components)
2. **Add type imports**: Import types from `@/types/api`
3. **Update function signatures**: Add parameter and return types
4. **Use typed API calls**: Replace `any` with specific interfaces

### Example Migration

**Before (JavaScript):**
```javascript
const sendOAuthToken = async (provider) => {
  const response = await fetch(`${API_URL}users/oauth/`, {
    method: 'POST',
    body: JSON.stringify(provider),
  });
  return response.json();
};
```

**After (TypeScript):**
```typescript
import { buildApiUrl, API_ENDPOINTS } from '@/config/api';
import { OAuthProvider, OAuthResponse } from '@/types/api';

const sendOAuthToken = async (provider: OAuthProvider): Promise<OAuthResponse> => {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.oauth), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(provider),
  });
  return response.json();
};
```

## Best Practices

1. **Always use interfaces**: Define types for API responses and data structures
2. **Leverage generics**: Use generic types for reusable API functions
3. **Strict typing**: Avoid `any` types whenever possible
4. **Consistent naming**: Use PascalCase for interfaces, camelCase for variables
5. **Export types**: Make interfaces available for other modules

## Adding New Endpoints

When adding new API endpoints:

1. **Add to interface**: Update `ApiEndpoints` interface in `/config/api.ts`
2. **Add to implementation**: Update the `API_ENDPOINTS` object
3. **Create types**: Add response/request types to `/types/api.ts`
4. **Use typed functions**: Create typed service functions

### Example: Adding a new endpoint

```typescript
// 1. Add to ApiEndpoints interface
export interface ApiEndpoints {
  // ... existing endpoints
  reviews: string; // Add new endpoint
}

// 2. Add to API_ENDPOINTS object
export const API_ENDPOINTS: ApiEndpoints = {
  // ... existing endpoints
  reviews: 'products/reviews/', // Add implementation
};

// 3. Create types in /types/api.ts
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewResponse extends ApiResponse<Review[]> {}

// 4. Create typed service function
export const getProductReviews = async (productId: string): Promise<ReviewResponse> => {
  const response = await fetch(buildApiUrl(`${API_ENDPOINTS.reviews}?product=${productId}`));
  return response.json();
};
```

## Environment Variables

Environment variables are now properly typed and centralized:

```typescript
export const ENV_CONFIG: EnvironmentConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  backendUrl: API_BASE_URL,
  telemetryDisabled: process.env.NEXT_TELEMETRY_DISABLED === '1',
};
```

Use `ENV_CONFIG` instead of directly accessing `process.env` for better type safety and consistency.
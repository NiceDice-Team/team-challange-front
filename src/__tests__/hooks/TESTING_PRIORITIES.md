# Hooks Testing Priority

## High Priority (Complex Logic)
1. useOptimisticCart.js - Complex state, debouncing, error handling
2. useUrlFilters.js - URL parameter management, filter logic  
3. usePaymentProcess.ts - Payment flow logic

## Medium Priority
4. useTokenManager.js - Token management, error handling
5. useCreatePaymentIntent.ts - Payment intent creation

## Lower Priority (React Query wrappers)
6. useCartQuery.js - Query wrappers (test through components)
7. useOrdersQuery.js - Simple query wrapper
8. useUpdateProfile.ts - Profile update wrapper

## Testing Strategy
- Keep src/__tests__/hooks/ folder
- Focus on hooks with complex business logic first
- React Query wrappers can be tested indirectly through component tests


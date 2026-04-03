import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsGrid from '@/components/catalog/ProductsGrid';
import { productServices } from '@/services/productServices';
import { catalogServices } from '@/services/catalogServices';
import type { SelectedFilters } from '@/types/catalog';

jest.mock('@/services/productServices', () => ({
  productServices: {
    getProductsWithFilters: jest.fn(),
  },
}));

jest.mock('@/services/catalogServices', () => ({
  catalogServices: {
    getProductCount: jest.fn(),
  },
}));

jest.mock('@/components/catalog/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => <div>{product.name}</div>,
}));

jest.mock('@/components/catalog/ProductCardSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="product-skeleton" />,
}));

jest.mock('@/components/ui/pagination', () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock('@/components/shared/CustomSelect', () => ({
  CustomSelect: ({ value }: { value: string }) => <div data-testid="sort-select">{value}</div>,
}));

const mockedProductServices = productServices as jest.Mocked<typeof productServices>;
const mockedCatalogServices = catalogServices as jest.Mocked<typeof catalogServices>;

const defaultFilters: SelectedFilters = {
  categories: [],
  gameTypes: [],
  audiences: [],
  brands: [],
  priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
  sortBy: 'relevance',
  search: '',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('ProductsGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads all products using a count request without relying on limit=1 metadata', async () => {
    mockedCatalogServices.getProductCount.mockResolvedValue({ count: 3 } as any);
    mockedProductServices.getProductsWithFilters.mockResolvedValue({
      total_count: 3,
      results: [
        { id: 1, name: 'Product 1', price: '10', stock: '5', images: [], reviews: [] },
        { id: 2, name: 'Product 2', price: '20', stock: '5', images: [], reviews: [] },
        { id: 3, name: 'Product 3', price: '30', stock: '5', images: [], reviews: [] },
      ],
    } as any);

    render(
      <ProductsGrid selectedFilters={defaultFilters} setSelectedFilters={jest.fn()} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    expect(mockedCatalogServices.getProductCount).toHaveBeenCalledWith(
      {
        categories: [],
        gameTypes: [],
        audiences: [],
        brands: [],
        search: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );

    expect(mockedProductServices.getProductsWithFilters).toHaveBeenCalledWith(
      1,
      3,
      'relevance',
      {
        categories: [],
        gameTypes: [],
        audiences: [],
        brands: [],
        search: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});

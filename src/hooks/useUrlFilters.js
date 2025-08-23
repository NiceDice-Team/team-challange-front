"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL search params
  const getInitialFilters = useCallback(() => {
    // Convert category IDs to numbers to match API data types
    const categories = searchParams.get('categories')?.split(',').filter(Boolean).map(id => parseInt(id, 10)) || [];
    const gameTypes = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const audiences = searchParams.get('audiences')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get('min_price')) || 0;
    const maxPrice = parseFloat(searchParams.get('max_price')) || 200;
    const sortBy = searchParams.get('sort') || 'relevance';
    const search = searchParams.get('search') || '';

    return {
      categories,
      gameTypes,
      audiences,
      brands,
      priceRange: { min: minPrice, max: maxPrice },
      sortBy,
      search
    };
  }, [searchParams]);

  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters);

  // Create query string from filters
  const createQueryString = useCallback((filters) => {
    const params = new URLSearchParams();
    
    if (filters.categories?.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    if (filters.gameTypes?.length > 0) {
      params.set('types', filters.gameTypes.join(','));
    }
    if (filters.audiences?.length > 0) {
      params.set('audiences', filters.audiences.join(','));
    }
    if (filters.brands?.length > 0) {
      params.set('brand', filters.brands.join(','));
    }
    if (filters.priceRange?.min > 0) {
      params.set('min_price', filters.priceRange.min.toString());
    }
    if (filters.priceRange?.max < 200) {
      params.set('max_price', filters.priceRange.max.toString());
    }
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      params.set('sort', filters.sortBy);
    }
    if (filters.search) {
      params.set('search', filters.search);
    }

    return params.toString();
  }, []);

  // Update URL when filters change
  const updateFilters = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
    
    const queryString = createQueryString(newFilters);
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use replace to avoid adding to browser history on every filter change
    router.replace(url, { scroll: false });
  }, [createQueryString, pathname, router]);

  // Update URL search params when they change (e.g., browser navigation)
  useEffect(() => {
    const newFilters = getInitialFilters();
    setSelectedFilters(newFilters);
  }, [getInitialFilters]);

  return {
    selectedFilters,
    updateFilters,
    setSelectedFilters: updateFilters
  };
};
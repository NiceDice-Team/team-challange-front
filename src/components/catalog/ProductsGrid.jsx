"use client";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useRef, useEffect } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";
import ProductCardSkeleton from "../catalog/ProductCardSkeleton";
import { Pagination } from "../ui/pagination";
import { CustomSelect } from "../shared/CustomSelect";

export default function ProductsGrid({ selectedFilters, setSelectedFilters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Match API page_size

  // Extract sortBy from selectedFilters or use default
  const sortBy = selectedFilters.sortBy || "relevance";

  const queryClient = useQueryClient();
  const prevSortRef = useRef(sortBy);
  const sortChanged = prevSortRef.current !== sortBy;

  // Handle sort change
  const setSortBy = (newSortBy) => {
    setSelectedFilters({
      ...selectedFilters,
      sortBy: newSortBy
    });
  };

  // Build a stable, normalized filters key so React Query doesn't refetch
  // due to object identity or array order changes.
  const filtersKey = useMemo(() => ({
    categories: [...(selectedFilters.categories || [])].sort(),
    gameTypes: [...(selectedFilters.gameTypes || [])].sort(),
    audiences: [...(selectedFilters.audiences || [])].sort(),
    brands: [...(selectedFilters.brands || [])].sort(),
    priceRange: {
      min: selectedFilters.priceRange?.min ?? 0,
      max: selectedFilters.priceRange?.max ?? 200,
    },
    search: selectedFilters.search || "",
  }), [selectedFilters]);

  // React to sort changes: force refetch even if cache is fresh, and scroll to top
  useEffect(() => {
    const key = ["allProducts", sortBy, filtersKey];
    queryClient.invalidateQueries({ queryKey: key });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
    prevSortRef.current = sortBy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // For filtering, we need all products with sorting and server-side filters
  const {
    data: allProductsData,
    isLoading: allProductsLoading,
    isFetching: allProductsFetching,
    error: allProductsError,
  } = useQuery({
    queryKey: ["allProducts", sortBy, filtersKey],
    queryFn: ({ signal }) => productServices.getAllProductsWithSort(sortBy, selectedFilters, { signal }),
    // Keep results warm for longer to reduce churn navigating back/forth
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes in cache
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    // Preserve previous page while fetching to avoid flashes
    // But for sort changes, show a fresh loading state (no placeholder)
    placeholderData: sortChanged ? undefined : keepPreviousData,
  });

  // Apply client-side filters and sorting for features not supported by backend
  const filteredAndSortedProducts = useMemo(() => {
    if (!allProductsData) return [];

    const productsArray = Array.isArray(allProductsData) ? allProductsData : [];

    if (!Array.isArray(productsArray)) {
      console.error("Products data is not an array:", allProductsData);
      return [];
    }

    // Apply client-side filtering for features not fully supported by backend
    let filtered = productsArray.filter((product) => {
      // Filter by price range (client-side only)
      const price = parseFloat(product.price) || 0;
      if (price < selectedFilters.priceRange.min || price > selectedFilters.priceRange.max) {
        return false;
      }

      // Filter by brands (client-side when multiple brands selected)
      if (selectedFilters.brands.length > 1) {
        // If more than one brand selected, apply client-side filtering
        if (!selectedFilters.brands.includes(product.brand)) {
          return false;
        }
      }

      return true;
    });

    // Apply client-side sorting if backend doesn't handle it or for special cases
    if (sortBy === "bestsellers") {
      // Sort by highest rating/stars
      filtered.sort((a, b) => {
        const aStars = parseFloat(a.stars) || 0;
        const bStars = parseFloat(b.stars) || 0;
        return bStars - aStars;
      });
    } else if (sortBy === "relevance") {
      // Custom relevance sorting (stock priority + default order)
      const highPriority = [];
      const lowPriority = [];

      filtered.forEach((product) => {
        if (parseInt(product.stock, 10) > 0 || parseFloat(product.price) == 0) {
          lowPriority.push(product);
        } else {
          highPriority.push(product);
        }
      });

      highPriority.sort((a, b) => parseInt(b.stock, 10) - parseInt(a.stock, 10));
      lowPriority.sort((a, b) => {
        const aHasStock = parseInt(a.stock, 10) > 0;
        const bHasStock = parseInt(b.stock, 10) > 0;

        if (aHasStock && !bHasStock) return -1;
        if (!aHasStock && bHasStock) return 1;

        return parseInt(b.stock, 10) - parseInt(a.stock, 10);
      });

      filtered = [...lowPriority, ...highPriority];
    }
    // For other sort options (price, newest), the backend API handles the sorting

    return filtered;
  }, [allProductsData, selectedFilters, sortBy]);

  // Reset to page 1 when filters or sort change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredAndSortedProducts?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredAndSortedProducts?.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.gameTypes.length > 0 ||
    selectedFilters.audiences.length > 0 ||
    selectedFilters.brands.length > 0 ||
    selectedFilters.priceRange.min > 0 ||
    selectedFilters.priceRange.max < 200;

  return (
    <section className="w-full">
      <div className="w-full flex flex-row justify-end items-center gap-4 mb-12">
        <span className="uppercase text-lg font-medium">Sort by</span>
        <CustomSelect
          placeholder="Relevance"
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: "relevance", label: "Relevance" },
            { value: "bestsellers", label: "Bestsellers" },
            { value: "price-high-low", label: "Price, high to low" },
            { value: "price-low-high", label: "Price, low to high" },
            { value: "newest", label: "Newest first" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 min-h-[400px]">
        {allProductsLoading &&
          // Show skeleton cards while loading
          Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)}

        {allProductsError && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-red-500">Error loading products</p>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {!allProductsLoading && !allProductsError && currentProducts?.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 text-lg">
                {hasActiveFilters ? "No products match your filters" : "No products found"}
              </p>
              {hasActiveFilters && <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>}
            </div>
          </div>
        )}

        {!allProductsLoading &&
          currentProducts &&
          currentProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>

      {/* Pagination */}
      {!allProductsLoading && totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </section>
  );
}

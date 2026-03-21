"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";
import ProductCardSkeleton from "../catalog/ProductCardSkeleton";
import { Pagination } from "../ui/pagination";
import { CustomSelect } from "../shared/CustomSelect";
import type { SelectedFilters } from "@/types/catalog";
import type { Product } from "@/types/product";

// Component props
interface ProductsGridProps {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}

export default function ProductsGrid({ selectedFilters, setSelectedFilters }: ProductsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const sortBy = selectedFilters.sortBy || "relevance";
  const hasUpperPriceLimit = Number.isFinite(selectedFilters.priceRange.max);
  const minPrice = selectedFilters.priceRange.min || 0;
  const maxPrice = hasUpperPriceLimit ? selectedFilters.priceRange.max : Number.POSITIVE_INFINITY;
  const nonPriceFilters = {
    categories: selectedFilters.categories,
    gameTypes: selectedFilters.gameTypes,
    audiences: selectedFilters.audiences,
    brands: selectedFilters.brands,
    search: selectedFilters.search,
  };

  const setSortBy = (newSortBy: string): void => {
    setSelectedFilters({
      ...selectedFilters,
      sortBy: newSortBy,
    });
  };

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy]);

  // Fetch the full dataset for all non-price filters and sort,
  // then apply price filtering locally because the current backend ignores price params.
  const {
    data: productsData,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "products",
      sortBy,
      selectedFilters.categories,
      selectedFilters.gameTypes,
      selectedFilters.audiences,
      selectedFilters.brands,
      selectedFilters.search,
    ],
    queryFn: async ({ signal }) => {
      const initialResponse = await productServices.getProductsWithFilters(
        1,
        1,
        sortBy,
        nonPriceFilters,
        { signal },
      );

      const totalCount = Math.max(initialResponse?.count || 0, initialResponse?.results?.length || 0);

      if (totalCount <= 1) {
        return initialResponse;
      }

      return productServices.getProductsWithFilters(1, totalCount, sortBy, nonPriceFilters, { signal });
    },
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = productsData?.results || [];
  const filteredProducts = allProducts.filter((product: Product) => {
    const price = parseFloat(String(product.price ?? 0));
    if (!Number.isFinite(price)) return false;

    return price >= minPrice && price <= maxPrice;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const isError = !!error;

  // Show loading skeleton when fetching (not just initial load)
  const showLoading = isFetching;

  // Check if any filters are active
  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.gameTypes.length > 0 ||
    selectedFilters.audiences.length > 0 ||
    selectedFilters.brands.length > 0 ||
    selectedFilters.priceRange.min > 0 ||
    hasUpperPriceLimit;

  return (
    <section className="w-full">
      <div className="mb-6 flex w-full items-center justify-between gap-4 sm:mb-8 lg:mb-12 lg:justify-end">
        <span className="text-lg font-medium uppercase leading-[22px] text-black lg:hidden">Filters</span>
        <span className="hidden uppercase text-sm sm:text-base lg:text-lg font-medium lg:inline-flex">Sort by</span>
        <CustomSelect
          placeholder="Relevance"
          value={sortBy}
          onValueChange={setSortBy}
          className="h-10 w-[176px] border-[#A4A3C8] px-4 text-base text-[#494791] lg:w-[200px]"
          options={[
            { value: "relevance", label: "Relevance" },
            { value: "bestsellers", label: "Bestsellers" },
            { value: "price-high-low", label: "Price, high to low" },
            { value: "price-low-high", label: "Price, low to high" },
            { value: "newest", label: "Newest first" },
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-[396px] min-h-[400px] grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showLoading &&
          // Show skeleton cards while loading
          Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)}

        {!showLoading && isError && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-red-500">Error loading products</p>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {!showLoading && !isError && currentProducts?.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 text-lg">
                {hasActiveFilters ? "No products match your filters" : "No products found"}
              </p>
              {hasActiveFilters && <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>}
            </div>
          </div>
        )}

        {!showLoading &&
          currentProducts &&
          currentProducts.map((product: Product) => <ProductCard product={product} key={product.id} />)}
      </div>

      {/* Pagination - Shows page numbers for visited pages */}
      {!showLoading && totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12 mb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            mobileSimpleMode
            className="gap-4"
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      )}
    </section>
  );
}

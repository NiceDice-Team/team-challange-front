"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";
import ProductCardSkeleton from "../catalog/ProductCardSkeleton";
import { Pagination } from "../ui/pagination";
import { CustomSelect } from "../shared/CustomSelect";
import type { SelectedFilters, ProductsGridProps } from "@/types/catalog";
import type { Product } from "@/types/product";

export default function ProductsGrid({ selectedFilters, setSelectedFilters }: ProductsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [maxVisitedPage, setMaxVisitedPage] = useState(1);
  const productsPerPage = 12;

  const sortBy = selectedFilters.sortBy || "relevance";

  const setSortBy = (newSortBy: string): void => {
    setSelectedFilters({
      ...selectedFilters,
      sortBy: newSortBy
    });
  };

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
    setMaxVisitedPage(1);
  }, [selectedFilters, sortBy]);

  // Track max visited page as user navigates
  useEffect(() => {
    setMaxVisitedPage(prev => Math.max(prev, currentPage));
  }, [currentPage]);

  // Fetch only current page products (12 items per page)
  // Using isFetching to show skeleton during page navigation
  const {
    data: paginatedData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["products", currentPage, sortBy, selectedFilters],
    queryFn: ({ signal }) => productServices.getProductsWithFilters(
      currentPage,
      productsPerPage,
      sortBy,
      selectedFilters,
      { signal }
    ),
    staleTime: 5 * 60 * 1000,
  });

  const currentProducts = paginatedData?.results || [];
  const isError = !!error;

  // Simple pagination logic: if we got full page, assume there's next page
  const hasNext = currentProducts.length === productsPerPage;

  // Calculate totalPages based on visited pages and hasNext
  // If there's a next page, show one more page button than we've visited
  const totalPages = hasNext ? maxVisitedPage + 1 : maxVisitedPage;

  // Show loading skeleton when fetching (not just initial load)
  const showLoading = isFetching;

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
      {!showLoading && (currentPage > 1 || hasNext) && (
        <div className="flex justify-center mt-12 mb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
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

"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";
import ProductCardSkeleton from "../catalog/ProductCardSkeleton";

export default function ProductsGrid({ selectedFilters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productServices.getProducts,
  });

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    // Handle different API response structures
    const productsArray = Array.isArray(products) ? products : products.data || products.results || [];

    if (!Array.isArray(productsArray)) {
      console.error("Products data is not an array:", products);
      return [];
    }

    // First, filter the products
    let filtered = productsArray.filter((product) => {
      // Filter by categories
      if (selectedFilters.categories.length > 0) {
        const hasCategory = product.categories?.some((cat) => selectedFilters.categories.includes(cat.id || cat));
        if (!hasCategory) return false;
      }

      // Filter by game types
      if (selectedFilters.gameTypes.length > 0) {
        const hasGameType = product.types?.some((type) => selectedFilters.gameTypes.includes(type.name || type));
        if (!hasGameType) return false;
      }

      // Filter by audiences
      if (selectedFilters.audiences.length > 0) {
        const hasAudience = product.audiences?.some((audience) =>
          selectedFilters.audiences.includes(audience.name || audience)
        );
        if (!hasAudience) return false;
      }

      // Filter by brands
      if (selectedFilters.brands.length > 0) {
        if (!selectedFilters.brands.includes(product.brand)) return false;
      }

      // Filter by price range
      const price = parseFloat(product.price) || 0;
      if (price < selectedFilters.priceRange.min || price > selectedFilters.priceRange.max) {
        return false;
      }

      return true;
    });

    // Then, sort the filtered products
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

    return [...lowPriority, ...highPriority];
  }, [products, selectedFilters]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
        {productsLoading &&
          // Show skeleton cards while loading
          Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)}

        {productsError && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-red-500">Error loading products</p>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {!productsLoading && !productsError && currentProducts?.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 text-lg">
                {hasActiveFilters ? "No products match your filters" : "No products found"}
              </p>
              {hasActiveFilters && <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>}
            </div>
          </div>
        )}

        {!productsLoading &&
          currentProducts &&
          currentProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>

      {/* Pagination */}
      {!productsLoading && totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : "border-[#494791] text-[#494791] hover:bg-[#494791] hover:text-white"
              }`}
            >
              Previous
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 border rounded transition-colors ${
                      currentPage === pageNumber
                        ? "bg-[#494791] text-white border-[#494791]"
                        : "border-[#494791] text-[#494791] hover:bg-[#494791] hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }

              // Show ellipsis for gaps
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return (
                  <span key={pageNumber} className="px-2">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : "border-[#494791] text-[#494791] hover:bg-[#494791] hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

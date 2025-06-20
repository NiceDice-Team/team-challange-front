"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";
import ProductCardSkeleton from "../catalog/ProductCardSkeleton";
import { Pagination } from "../ui/Pagination";

export default function ProductsGrid({ selectedFilters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Match API page_size

  // For filtering, we need all products
  const {
    data: allProductsData,
    isLoading: allProductsLoading,
    error: allProductsError,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: productServices.getAllProducts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    if (!allProductsData) return [];

    const productsArray = Array.isArray(allProductsData) ? allProductsData : [];

    if (!Array.isArray(productsArray)) {
      console.error("Products data is not an array:", allProductsData);
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
  }, [allProductsData, selectedFilters]);

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

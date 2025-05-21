"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";

export default function ProductsGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  // const [lowPriority, setLowPriority] = useState();
  const productsPerPage = 16;

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productServices.getProducts,
  });
  const sortedProducts = useMemo(() => {
    if (!products) return [];

    const highPriority = [];
    const lowPriority = [];

    products.forEach((product) => {
      if (parseInt(product.stock, 10) > 0 || parseFloat(product.price) == 0) {
        lowPriority.push(product);
      } else {
        highPriority.push(product);
      }
    });
    highPriority.sort((a, b) => parseInt(b.stock, 10) - parseInt(a.stock, 10));
    lowPriority.sort((a, b) => {
      // First prioritize by whether it has stock
      const aHasStock = parseInt(a.stock, 10) > 0;
      const bHasStock = parseInt(b.stock, 10) > 0;

      if (aHasStock && !bHasStock) return -1;
      if (!aHasStock && bHasStock) return 1;

      // Then by stock amount
      return parseInt(b.stock, 10) - parseInt(a.stock, 10);
    });

    return [...lowPriority, ...highPriority];
  }, [products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = sortedProducts?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts?.length / productsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Optionally scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  return (
    <section className="mt-14">
      <div className="grid grid-cols-4 grid-rows-4 gap-4">
        {productsLoading && <div>Loading products...</div>}
        {productsError && <div>Error loading products</div>}
        {currentProducts && currentProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-[#494791] text-[#494791] hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${
                  currentPage === index + 1
                    ? "bg-[#494791] text-white"
                    : "border-[#494791] text-[#494791] hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-[#494791] text-[#494791] hover:bg-gray-100"
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

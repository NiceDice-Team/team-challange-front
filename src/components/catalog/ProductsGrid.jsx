"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productServices } from "../../services/productServices";
import ProductCard from "../catalog/ProductCard";

export default function ProductsGrid() {
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products?.length / productsPerPage);
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

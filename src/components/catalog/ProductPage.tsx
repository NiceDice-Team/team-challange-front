"use client";
import { useQuery } from "@tanstack/react-query";
import { productServices } from "../../services/productServices";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ProductAccordion } from "./ProductPageAccordion";
import { CustomBreadcrumb } from "../shared/CustomBreadcrumb";
import { useAddToCart } from "@/hooks/useCartQuery";
import type { ProductPageProps, StockStatus } from "@/types/product";

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addToCartMutation = useAddToCart();

  const productId = params?.id;
  const isInvalidId = productId === "[object Object]";

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => productServices.getProductById(productId, { signal }),
    enabled: !!productId && !isInvalidId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Handle invalid product ID redirect
  useEffect(() => {
    if (isInvalidId) {
      console.warn("Invalid product ID received, redirecting...");
      window.location.href = "/catalog";
    }
  }, [isInvalidId]);

  // Show nothing while redirecting
  if (isInvalidId) {
    return null;
  }

  // If no product ID, show error
  if (!productId) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-red-500 text-base sm:text-lg">Invalid product ID</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="space-y-4 sm:space-y-6">
            <div className="h-6 sm:h-8 bg-gray-200 animate-pulse"></div>
            <div className="h-5 sm:h-6 bg-gray-200 animate-pulse w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-red-500 text-base sm:text-lg">Error loading product</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-gray-500 text-base sm:text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (addToCartMutation.isPending) return; // Prevent multiple rapid clicks

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: quantity,
        productData: product,
      });

      // TODO: console.log убрать и добавить Toast (в будущем)
      console.log(`✅ Added ${quantity} of "${product.name}" to cart!`);
      // Optional: Show success feedback or reset quantity to 1
      // setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("❌ Failed to add product to cart. Please try again.");
    }
  };

  const stockQuantity = parseInt(product.stock) || 0;
  const isInStock = stockQuantity > 0;

  // Determine stock status based on quantity
  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) {
      return {
        message: "Sold out",
        color: "var(--color-gray-2)",
        status: "sold-out",
      };
    } else if (stock >= 1 && stock <= 5) {
      return {
        message: `Very low stock (${stock} units)`,
        color: "var(--color-red-stock)",
        status: "very-low",
      };
    } else if (stock >= 6 && stock <= 10) {
      return {
        message: `Low stock (${stock} units)`,
        color: "var(--color-orange)",
        status: "low",
      };
    } else {
      return {
        message: "In stock",
        color: "var(--color-green)",
        status: "in-stock",
      };
    }
  };

  const stockStatus = getStockStatus(stockQuantity);

  const discountPrice =
    product.discount && parseFloat(product.discount) > 0
      ? (parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2)
      : null;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board Games", href: "/catalog" },
    { label: product?.name || "Product", current: true },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Product Image Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Image Container */}
          <div className="relative w-full max-w-full sm:max-w-[500px] lg:max-w-[600px] mx-auto flex items-center">
            {/* Back Button */}
            <button
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex === 0 ? (product?.images?.length || 1) - 1 : selectedImageIndex - 1
                )
              }
              className="flex-shrink-0 transition-opacity hover:opacity-80 p-1 sm:p-0"
              disabled={selectedImageIndex === 0}
            >
              {selectedImageIndex === 0 ? (
                // Disabled state
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="40"
                    y="40"
                    width="40"
                    height="40"
                    rx="20"
                    transform="rotate(-180 40 40)"
                    fill="#494791"
                    fillOpacity="0.5"
                  />
                  <path
                    d="M24.122 10.6887L25.186 11.7527L16.941 19.9967L25.186 28.2407L24.122 29.3047L14.814 19.9967L24.122 10.6887Z"
                    fill="white"
                  />
                </svg>
              ) : (
                // Active state
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="40" y="40" width="40" height="40" rx="20" transform="rotate(-180 40 40)" fill="#494791" />
                  <path
                    d="M24.122 10.6887L25.186 11.7527L16.941 19.9967L25.186 28.2407L24.122 29.3047L14.814 19.9967L24.122 10.6887Z"
                    fill="white"
                  />
                </svg>
              )}
            </button>

            {/* Square aspect ratio container */}
            <div className="aspect-square flex-1 relative">
              <Image
                src={product?.images?.[selectedImageIndex]?.url_lg}
                alt={product?.images?.[selectedImageIndex]?.alt || product?.name || "Product image"}
                fill
                className="object-contain"
                priority
                unoptimized={product?.images?.[selectedImageIndex]?.url_lg?.includes("placehold.co")}
              />
            </div>

            {/* Forward Button */}
            <button
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex === (product?.images?.length || 1) - 1 ? 0 : selectedImageIndex + 1
                )
              }
              className="flex-shrink-0 transition-opacity hover:opacity-80 p-1 sm:p-0"
              disabled={selectedImageIndex === (product?.images?.length || 1) - 1}
            >
              {selectedImageIndex === (product?.images?.length || 1) - 1 ? (
                // Disabled state
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#494791" fillOpacity="0.5" />
                  <path
                    d="M15.878 29.3113L14.814 28.2473L23.059 20.0033L14.814 11.7593L15.878 10.6953L25.186 20.0033L15.878 29.3113Z"
                    fill="white"
                  />
                </svg>
              ) : (
                // Active state
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#494791" />
                  <path
                    d="M15.878 29.3113L14.814 28.2473L23.059 20.0033L14.814 11.7593L15.878 10.6953L25.186 20.0033L15.878 29.3113Z"
                    fill="white"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Thumbnail images */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-full sm:max-w-[500px] lg:max-w-[600px] mx-auto pb-2">
            {product?.images?.map((image, index) => (
              <div
                key={image.id || index}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[104px] lg:h-[104px] overflow-hidden cursor-pointer relative transition-opacity ${
                  selectedImageIndex === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.url_sm}
                  alt={image.alt || `Product image ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  unoptimized={image.url_sm?.includes("placehold.co")}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
          {/* Product Information Section */}
          <div>
            {/* Brand and SKU */}
            <div className="mb-2 text-sm sm:text-base lg:text-lg text-[var(--color-purple)] uppercase flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              {product.brand && <span>{product.brand}</span>}
              <span className="text-xs sm:text-sm lg:text-base text-[var(--color-gray-2)]">
                SKU: {product.id.toString().padStart(6, "0")}
              </span>
            </div>
            {/* Product Title */}
            <h1 className="leading-tight text-xl sm:text-2xl md:text-3xl lg:text-[40px] uppercase text-black">
              {product.name}
            </h1>
          </div>

          <div>
            {/* Price */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-baseline gap-2 sm:gap-3">
                {discountPrice ? (
                  <>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">${discountPrice}</span>
                    <span className="text-base sm:text-lg lg:text-xl text-gray-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black">${product.price}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stockStatus.color }}></div>
            <span className="text-sm sm:text-base" style={{ color: stockStatus.color }}>
              {stockStatus.message}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-600 text-lg sm:text-base"
                  disabled={!isInStock}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={isInStock ? stockQuantity : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={!isInStock}
                  className="w-12 sm:w-16 text-center py-2 border-0 focus:outline-none disabled:bg-gray-50 text-base"
                />
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-600 text-lg sm:text-base"
                  disabled={!isInStock || quantity >= stockQuantity}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addToCartMutation.isPending}
                className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-base text-white font-medium transition-colors ${
                  isInStock && !addToCartMutation.isPending
                    ? "bg-[color:var(--color-purple)] hover:opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
              </button>
            </div>
          </div>

          {/* Accordion */}
          <ProductAccordion accordionParams={product} />
        </div>
      </div>
    </div>
  );
}

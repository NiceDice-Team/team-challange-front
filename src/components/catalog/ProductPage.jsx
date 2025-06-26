"use client";
import { useQuery } from "@tanstack/react-query";
import { productServices } from "../../services/productServices";
import { useState } from "react";
import Image from "next/image";

export default function ProductPage({ params }) {
  const [quantity, setQuantity] = useState(1);

  let productId = params?.id;

  if (productId === "[object Object]") {
    console.warn("Invalid product ID received, redirecting...");
    if (typeof window !== "undefined") {
      window.location.href = "/catalog";
    }
    return null;
  }

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productServices.getProductById(productId),
    enabled: !!productId && productId !== "[object Object]",
  });

  // If no product ID, show error
  if (!productId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-red-500 text-lg">Invalid product ID</p>
          <p className="text-gray-500 mt-2">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200  animate-pulse"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200  animate-pulse"></div>
            <div className="h-6 bg-gray-200  animate-pulse w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200  animate-pulse"></div>
              <div className="h-4 bg-gray-200  animate-pulse"></div>
              <div className="h-4 bg-gray-200  animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-red-500 text-lg">Error loading product</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Adding ${quantity} of product ${product.id} to cart`);
  };

  const stockQuantity = parseInt(product.stock) || 0;
  const isInStock = stockQuantity > 0;

  // Determine stock status based on quantity
  const getStockStatus = (stock) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100  flex items-center justify-center overflow-hidden  relative">
            {product.images &&
            product.images.length > 0 &&
            product.images[0] &&
            typeof product.images[0] === "string" &&
            product.images[0].trim() !== "" ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain"
                unoptimized
                onError={(e) => {
                  console.warn("Product image failed to load:", product.images[0]);
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="text-center text-gray-400 p-8">
                <div className="w-32 h-32 mx-auto mb-4 border-2   flex items-center justify-center">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Thumbnail images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images
                .slice(0, 4)
                .filter((img) => img && typeof img === "string" && img.trim() !== "")
                .map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-16 h-16 bg-gray-100  border overflow-hidden cursor-pointer hover:opacity-80 relative"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        console.warn("Thumbnail image failed to load:", image);
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Product Information Section */}
          <div className="">
            {/* Brand and SKU */}
            <div className="mb-2 text-lg text-[var(--color-purple)] uppercase  flex justify-between items-center">
              {product.brand && <span>{product.brand}</span>}
              <span className="text-base text-[var(--color-gray-2)]">
                SKU: {product.id.toString().padStart(6, "0")}
              </span>
            </div>
            {/* Product Title */}
            <h1 className="leading-none text-[40px] uppercase text-black">{product.name}</h1>
          </div>

          <div>
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                {discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">${discountPrice}</span>
                    <span className="text-xl text-gray-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-5xl  text-black">${product.price}</span>
                )}
              </div>
            </div>
            {/* Short Description */}
            <div>
              <p className="text-base text-black">
                Ticket to Ride: Europe is a captivating game that combines simple rules with strategic depth, making it
                a fantastic addition to family game nights, game clubs, or casual gaming sessions. Will you become the
                greatest rail baron across Europe?
              </p>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stockStatus.color }}></div>
            <span className="text-base" style={{ color: stockStatus.color }}>
              {stockStatus.message}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 ">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600"
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
                  className="w-16 text-center py-2 border-0 focus:outline-none disabled:bg-gray-50"
                />{" "}
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600"
                  disabled={!isInStock || quantity >= stockQuantity}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-3 px-6  text-white font-medium transition-colors ${
                  isInStock ? "bg-[color:var(--color-purple)] hover:opacity-90" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

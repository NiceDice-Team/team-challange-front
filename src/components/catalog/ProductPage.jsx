"use client";
import { useQuery } from "@tanstack/react-query";
import { productServices } from "../../services/productServices";
import { useState } from "react";
import StarsLine from "../layout/StarsLine";
import Image from "next/image";

export default function ProductPage({ params }) {
  const [quantity, setQuantity] = useState(1);

  // Ensure params.id exists and handle edge cases
  let productId = params?.id;

  // Handle the [object Object] case
  if (productId === "[object Object]" || productId === "%5Bobject%20Object%5D") {
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
    enabled: !!productId && productId !== "[object Object]" && productId !== "%5Bobject%20Object%5D",
  });

  // Debug logging
  console.log("ProductPage Debug:", {
    params,
    productId,
    isLoading,
    error: error?.message,
    product: product ? { id: product.id, name: product.name } : null,
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

  const isInStock = parseInt(product.stock) > 0;
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
            {product.images && product.images.length > 0 && product.images[0] && 
             typeof product.images[0] === 'string' && product.images[0].trim() !== "" ? (
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-contain" 
                unoptimized 
                onError={(e) => {
                  console.warn("Product image failed to load:", product.images[0]);
                  e.target.style.display = 'none';
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
              {product.images.slice(0, 4).filter(img => img && typeof img === 'string' && img.trim() !== "").map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border overflow-hidden cursor-pointer hover:opacity-80 relative"
                >
                  <Image 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    fill 
                    className="object-cover" 
                    unoptimized 
                    onError={(e) => {
                      console.warn("Thumbnail image failed to load:", image);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          {/* Brand and SKU */}
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            {product.brand && <span>{product.brand}</span>}
            <span className="ml-4">SKU: {product.id.toString().padStart(6, "0")}</span>
          </div>

          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              {discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">${discountPrice}</span>
                  <span className="text-xl text-gray-500 line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`text-sm font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}>
                {isInStock ? `Very low stock (${product.stock} units)` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded">
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
                  max={isInStock ? product.stock : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={!isInStock}
                  className="w-16 text-center py-2 border-0 focus:outline-none disabled:bg-gray-50"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600"
                  disabled={!isInStock || quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-3 px-6 rounded text-white font-medium transition-colors ${
                  isInStock ? "bg-[color:var(--color-purple)] hover:opacity-90" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-0 border-t pt-6">
            {/* Description */}
            <details className="group border-b border-gray-200">
              <summary className="flex items-center justify-between cursor-pointer py-4 text-[16px] font-medium text-[color:var(--color-purple)] hover:opacity-80">
                DESCRIPTION
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pb-4 text-[16px] text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            </details>

            {/* Game Information */}
            <details className="group border-b border-gray-200">
              <summary className="flex items-center justify-between cursor-pointer py-4 text-[16px] font-medium text-[color:var(--color-purple)] hover:opacity-80">
                GAME INFORMATION
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pb-4 text-[16px] text-gray-900 space-y-3">
                {product.brand && (
                  <div className="flex">
                    <span className="font-medium">• Publisher:</span>
                    <span className="ml-2 underline cursor-pointer">{product.brand}</span>
                  </div>
                )}

                <div className="flex">
                  <span className="font-medium">• Players:</span>
                  <span className="ml-2">2-5</span>
                </div>

                <div className="flex">
                  <span className="font-medium">• Ages:</span>
                  <span className="ml-2">8+</span>
                </div>

                <div className="flex">
                  <span className="font-medium">• Play Time:</span>
                  <span className="ml-2">30-60 Minutes</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium">• Includes:</span>
                  <span className="ml-2">Game board, cards, tokens, and instructions</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium">• Game Features:</span>
                  <span className="ml-2">Strategic gameplay, exciting challenges, and engaging player interaction</span>
                </div>

                {product.categories && product.categories.length > 0 && (
                  <div className="flex">
                    <span className="font-medium">• Categories:</span>
                    <span className="ml-2">{product.categories.map((cat) => cat.name || cat).join(", ")}</span>
                  </div>
                )}

                {product.types && product.types.length > 0 && (
                  <div className="flex">
                    <span className="font-medium">• Game Type:</span>
                    <span className="ml-2">{product.types.map((type) => type.name || type).join(", ")}</span>
                  </div>
                )}
              </div>
            </details>

            {/* Delivery and Payment */}
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4 text-[16px] font-medium text-[color:var(--color-purple)] hover:opacity-80">
                DELIVERY AND PAYMENT
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pb-4 text-[16px] text-gray-900 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">🚚 Shipping Within Ukraine</h4>
                  <div className="space-y-1 ml-6">
                    <p>
                      <strong>Delivery Methods:</strong>
                    </p>
                    <p>• Nova Poshta: 1-3 business days</p>
                    <p>• Ukrposhta: 2-5 business days</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🌍 International Shipping</h4>
                  <div className="space-y-1 ml-6">
                    <p>• Carriers: Ukrposhta, Nova Poshta, DHL, FedEx</p>
                    <p>• Delivery Time: 7-14 business days</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">💳 Payment Methods</h4>
                  <div className="ml-6">
                    <p>Credit/Debit Card, PayPal, Bank Transfer</p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

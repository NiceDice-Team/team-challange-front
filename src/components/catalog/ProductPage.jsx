"use client";
import { useQuery } from "@tanstack/react-query";
import { productServices } from "../../services/productServices";
import { useState } from "react";
import Image from "next/image";
import { ProductAccordion } from "./ProductPageAccordion";
import { CustomBreadcrumb } from "../shared/CustomBreadcrumb";
import { useAddToCart } from "@/hooks/useCartQuery";

// Import test images
import testImg1 from "../../../public/DynamicProduct/product_id_page_test_img_1.jpg";
import testImg2 from "../../../public/DynamicProduct/product_id_page_test_img_2.jpg";
import testImg3 from "../../../public/DynamicProduct/product_id_page_test_img_3.jpg";
import testImg4 from "../../../public/DynamicProduct/product_id_page_test_img_4.jpg";
import testImg5 from "../../../public/DynamicProduct/product_id_page_test_img_5.jpg";

export default function ProductPage({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addToCartMutation = useAddToCart();

  // Test images array
  const testImages = [testImg1, testImg2, testImg3, testImg4, testImg5];

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

  const handleAddToCart = async () => {
    if (addToCartMutation.isPending) return; // Prevent multiple rapid clicks
    
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: quantity,
        productData: product
      });
      
      // TODO: console.log убрать и добавить Toast (в будущем)
      console.log(`✅ Added ${quantity} of "${product.name}" to cart!`);
      // Optional: Show success feedback or reset quantity to 1
      // setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('❌ Failed to add product to cart. Please try again.');
    }
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board Games", href: "/catalog" },
    { label: product?.name || "Product", current: true },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-8 lg:px-16 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image Section */}
        <div className="space-y-4">
          {/* Main Image Container */}
          <div className="relative w-full max-w-[600px] mx-auto flex items-center ">
            {/* Back Button */}
            <button
              onClick={() =>
                setSelectedImageIndex(selectedImageIndex === 0 ? testImages.length - 1 : selectedImageIndex - 1)
              }
              className="flex-shrink-0 transition-opacity hover:opacity-80"
              disabled={selectedImageIndex === 0}
            >
              {selectedImageIndex === 0 ? (
                // Disabled state
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                src={testImages[selectedImageIndex]}
                alt={product?.name || "Product image"}
                fill
                className="object-contain "
                priority
              />
            </div>

            {/* Forward Button */}
            <button
              onClick={() =>
                setSelectedImageIndex(selectedImageIndex === testImages.length - 1 ? 0 : selectedImageIndex + 1)
              }
              className="flex-shrink-0 transition-opacity hover:opacity-80"
              disabled={selectedImageIndex === testImages.length - 1}
            >
              {selectedImageIndex === testImages.length - 1 ? (
                // Disabled state
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="20" fill="#494791" fillOpacity="0.5" />
                  <path
                    d="M15.878 29.3113L14.814 28.2473L23.059 20.0033L14.814 11.7593L15.878 10.6953L25.186 20.0033L15.878 29.3113Z"
                    fill="white"
                  />
                </svg>
              ) : (
                // Active state
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="flex gap-1 overflow-x-auto max-w-[600px] mx-auto">
            {testImages.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[104px] h-[104px] overflow-hidden cursor-pointer relative transition-opacity ${
                  selectedImageIndex === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image src={image} alt={`Product image ${index + 1}`} fill className="object-contain p-1" />
              </div>
            ))}
          </div>
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
                disabled={!isInStock || addToCartMutation.isPending}
                className={`flex-1 py-3 px-6 text-white font-medium transition-colors ${
                  isInStock && !addToCartMutation.isPending 
                    ? "bg-[color:var(--color-purple)] hover:opacity-90" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {addToCartMutation.isPending ? 'ADDING...' : 'ADD TO CART'}
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

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  StarEmptyIcon,
  StarFilledIcon,
  CircleRedIcon,
  CircleOrangeIcon,
  CircleGreenIcon,
  CircleGrayIcon,
  HeartFilledIcon,
  HeartEmptyIcon,
} from "@/svgs/icons";
import { useAddToCart } from "@/hooks/useCartQuery";
import { roundRatingToNearestHalf } from "@/lib/reviewMetrics";
import {
  getProductAvailability,
  getProductAvailabilityMessage,
} from "@/lib/productAvailability";
import { CustomButton } from "@/components/shared/CustomButton";
import type { Product } from "@/types/product";

interface CartProductCardProps {
  product: Product;
}

export default function CartProductCard({ product }: CartProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const addToCartMutation = useAddToCart();

  // Create star rating display
  const renderStars = () => {
    const rating = roundRatingToNearestHalf(product?.stars || 0);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = !isFilled && i - 0.5 === rating;

      stars.push(
        <div key={i} className="relative block h-4 w-4 text-[#494791]">
          {isFilled ? (
            <Image src={StarFilledIcon} alt="filled star" width={16} height={16} className="h-4 w-4" />
          ) : isHalfFilled ? (
            <>
              <Image src={StarEmptyIcon} alt="half star" width={16} height={16} className="h-4 w-4" />
              <span className="absolute inset-0 block w-1/2 overflow-hidden" aria-hidden="true">
                <Image src={StarFilledIcon} alt="" width={16} height={16} className="h-4 w-4 max-w-none" />
              </span>
            </>
          ) : (
            <Image src={StarEmptyIcon} alt="empty star" width={16} height={16} className="h-4 w-4" />
          )}
        </div>
      );
    }
    return stars;
  };

  // Format price
  const displayPrice = product?.price ? `$${parseFloat(String(product.price)).toFixed(2)}` : "$0.00";
  const originalPrice = product?.original_price ? `$${parseFloat(String(product.original_price)).toFixed(2)}` : null;

  // Stock status
  const availability = getProductAvailability(product.stock);
  const isComingSoon = availability.status === "coming-soon";
  const isOutOfStock = !availability.isPurchasable;
  let stockCircle;
  let stockStyle;
  
  if (availability.status === "coming-soon" || availability.status === "sold-out") {
    stockCircle = <Image src={CircleGrayIcon} alt="" width={8} height={8} className="h-2 w-2" />;
    stockStyle = "text-[#717171]";
  } else if (availability.status === "very-low") {
    stockCircle = <Image src={CircleRedIcon} alt="very low stock" width={8} height={8} className="h-2 w-2" />;
    stockStyle = "text-[#EC3535]";
  } else if (availability.status === "low") {
    stockCircle = <Image src={CircleOrangeIcon} alt="medium stock" width={8} height={8} className="h-2 w-2" />;
    stockStyle = "text-[#FF7C40]";
  } else {
    stockCircle = <Image src={CircleGreenIcon} alt="high stock" width={8} height={8} className="h-2 w-2" />;
    stockStyle = "text-[#3A9B25]";
  }
  const stockMessage = getProductAvailabilityMessage(availability, "simple");

  const imageUrl = product.images?.[0]?.url_sm || '/FirstPlaceholder.svg';
  const handleAddToCart = async () => {
    if (addToCartMutation.isPending) return; // Prevent multiple rapid clicks
    
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product
      });
    } catch {
      // Error feedback is handled in the cart mutation hook.
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically call an API to save/remove favorite
  };

  return (
    <div className="w-[245px] h-[427px] flex flex-col bg-white p-2">
      {/* Image Section */}
      <div className="relative w-full h-[190px] mb-4">
        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="w-full h-[182px] relative overflow-hidden block hover:opacity-75 transition-opacity">
          <Image 
            src={imageUrl}
            alt={product.name || 'Product'}
            fill
            sizes="229px"
            className="object-contain object-center"
          />
        </Link>
        
        {/* Progress Lines */}
        <div className="flex gap-px mt-2">
          <div className="w-[72px] h-[3px] bg-[#A4A3C8]"></div>
          <div className="w-[72px] h-[3px] bg-[#494791]"></div>
          <div className="w-[72px] h-[3px] bg-[#A4A3C8]"></div>
        </div>

        {/* Favorite Heart Button - Positioned like Figma design */}
        <button 
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {isFavorite ? <HeartFilledIcon /> : <HeartEmptyIcon />}
        </button>
      </div>

      {/* Product Info Section - Fixed height to ensure button alignment */}
      <div className="flex-1 flex flex-col h-[233px]">
        {/* Content that can vary in height */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Product Name - Fixed height with line clamp */}
          <Link href={`/product/${product.id}`} className="hover:text-[#494791] transition-colors">
            <h3 className="text-lg font-medium text-black uppercase leading-[22px] mb-2 h-[44px] line-clamp-2 overflow-hidden">
              {product.name || 'Product Name'}
            </h3>
          </Link>

          {/* Rating - Fixed height */}
          <div className="flex items-center gap-1 mb-2 h-[16px]">
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <span className="text-sm text-black ml-1">
              ({product.review_count || 0})
            </span>
          </div>

          {/* Price Section - Fixed height */}
          <div className="mb-2 h-[32px] flex items-end">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium text-black">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-[#717171] line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status - Fixed height */}
          <div className={`flex items-center gap-2 mb-4 h-[16px] ${stockStyle}`}>
            {stockCircle}
            <span className="text-sm">
              {stockMessage}
            </span>
          </div>
        </div>

        {/* Add to Cart Button - Always at bottom with fixed height */}
        <CustomButton
          type="button"
          styleType="productCart"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || isOutOfStock}
        >
          {isComingSoon
            ? "COMING SOON"
            : isOutOfStock
              ? "SOLD OUT"
              : addToCartMutation.isPending
                ? "ADDING..."
                : "ADD TO CART"}
        </CustomButton>
      </div>
    </div>
  );
}

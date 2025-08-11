import Image from "next/image";
import React, { useState } from "react";
import {
  StarEmptyIcon,
  StarFilledIcon,
  CircleRedIcon,
  CircleOrangeIcon,
  CircleGreenIcon,
  CircleGrayIcon,
} from "@/svgs/icons";
import { useAddToCart } from "@/context/CartContext";

export default function CartProductCard({ product = {} }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useAddToCart();

  // Create star rating display
  const renderStars = () => {
    const rating = parseFloat(product?.stars || 0);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="text-[#494791]">
          {i <= rating ? (
            <img src={StarFilledIcon} alt="filled star" className="h-4 w-4" />
          ) : (
            <img src={StarEmptyIcon} alt="empty star" className="h-4 w-4" />
          )}
        </span>
      );
    }
    return stars;
  };

  // Format price
  const displayPrice = product?.price ? `$${parseFloat(product.price).toFixed(2)}` : "$0.00";
  const originalPrice = product?.original_price ? `$${parseFloat(product.original_price).toFixed(2)}` : null;

  // Stock status
  const stock = parseInt(product.stock, 10) || 0;
  let stockCircle;
  let stockMessage;
  let stockStyle;
  
  if (stock === 0) {
    stockMessage = "Sold out";
    stockCircle = <img src={CircleGrayIcon} alt="sold out" className="h-2 w-2" />;
    stockStyle = "text-[#717171]";
  } else if (stock <= 5) {
    stockMessage = `Very low stock (${stock} unit${stock > 1 ? 's' : ''})`;
    stockCircle = <img src={CircleRedIcon} alt="very low stock" className="h-2 w-2" />;
    stockStyle = "text-[#EC3535]";
  } else if (stock <= 10) {
    stockMessage = `In stock`;
    stockCircle = <img src={CircleOrangeIcon} alt="medium stock" className="h-2 w-2" />;
    stockStyle = "text-[#FF7C40]";
  } else {
    stockMessage = `In stock`;
    stockCircle = <img src={CircleGreenIcon} alt="high stock" className="h-2 w-2" />;
    stockStyle = "text-[#3A9B25]";
  }

  const imageUrl = product.images?.[0]?.url || '/FirstPlaceholder.svg';
  const brandName = product.brand?.name || 'Unknown Brand';

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple rapid clicks
    
    setIsAddingToCart(true);
    try {
      const result = await addToCart(product, 1);
      
      if (result.success) {
        // Success feedback - could be a toast notification instead
        console.log(`✅ "${product.name || 'Product'}" added to cart!`);
      } else {
        // Show error message
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('❌ Failed to add product to cart. Please try again.');
    } finally {
      // Re-enable button after a short delay to prevent spam clicking
      setTimeout(() => setIsAddingToCart(false), 500);
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
        <div className="w-full h-[182px] relative overflow-hidden">
          <Image 
            src={imageUrl}
            alt={product.name || 'Product'}
            fill
            className="object-cover"
          />
        </div>
        
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
          {isFavorite ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#494791" stroke="#494791" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#494791" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Product Info Section - Fixed height to ensure button alignment */}
      <div className="flex-1 flex flex-col h-[233px]">
        {/* Content that can vary in height */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Product Name - Fixed height with line clamp */}
          <h3 className="text-lg font-medium text-black uppercase leading-[22px] mb-2 h-[44px] line-clamp-2 overflow-hidden">
            {product.name || 'Product Name'}
          </h3>

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
        <button 
          className={`w-full py-3 px-8 border border-[#494791] text-base font-medium uppercase transition-colors duration-200 h-[49px] flex items-center justify-center ${
            isAddingToCart 
              ? 'bg-[#494791]/70 text-white cursor-not-allowed' 
              : 'text-[#494791] hover:bg-[#494791] hover:text-white'
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
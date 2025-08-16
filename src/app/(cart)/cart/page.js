'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { CustomBreadcrumb } from '../../../components/shared/CustomBreadcrumb';
import CartItem from '../../../components/cart/CartItem';
import CartProductCard from '../../../components/cart/CartProductCard';
import ProductCardSkeleton from '../../../components/catalog/ProductCardSkeleton';
import { useCartQuery, useUpdateCartQuantity, useRemoveFromCart } from '../../../hooks/useCartQuery';
import { productServices } from '../../../services/cartServices';

export default function CartPage() {
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveFromCart();
  
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load recommendations on component mount
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const products = await productServices.getRandomProducts(5);
      setRecommendedProducts(products);
    } catch (err) {
      console.error('Recommendations API error:', err);
      setRecommendedProducts([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await removeItemMutation.mutateAsync(cartItemId);
    } catch (err) {
      setError('Failed to remove item');
    }
  }, [removeItemMutation]);

  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeItemMutation.mutateAsync(cartItemId);
      } else {
        await updateQuantityMutation.mutateAsync({ cartItemId, quantity: newQuantity });
      }
    } catch (err) {
      setError('Failed to update quantity');
    }
  }, [updateQuantityMutation, removeItemMutation]);

  const applyCoupon = () => {
    // Handle coupon application
    // TODO: Implement coupon logic
  };

  // Calculate totals
  const { subtotal, remainingForFreeShipping, shippingProgress } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || 0);
      return sum + (price * item.quantity);
    }, 0);
    
    const freeShippingThreshold = 60;
    const calculatedRemaining = Math.max(0, freeShippingThreshold - calculatedSubtotal);
    const calculatedProgress = Math.min(100, (calculatedSubtotal / freeShippingThreshold) * 100);
    
    return {
      subtotal: calculatedSubtotal,
      remainingForFreeShipping: calculatedRemaining,
      shippingProgress: calculatedProgress
    };
  }, [cartItems]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Board games', href: '/catalog' },
    { label: 'Cart', href: '/cart', current: true }
  ];

  if (cartLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1320px] mx-auto px-8 lg:px-16">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="py-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Cart Header */}
      <div className="pb-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] leading-tight font-normal text-[#040404] uppercase">
            your cart ({cartItems.length})
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-base">
            <span className="text-black">Not ready to checkout?</span>
            <Link href="/catalog" className="flex items-center gap-1 text-black hover:text-[#494791] transition-colors">
              <span>Continue Shopping</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#494791" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 lg:gap-16">
        {/* Main Cart Section */}
        <div className="flex-1 max-w-none xl:max-w-4xl">
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Table Headers - Hidden on mobile */}
            <div className="hidden md:flex justify-between items-center pb-4 mb-6 border-b border-[#494791]/50">
              <div className="flex-1 text-sm md:text-base font-normal text-[#040404] uppercase">
                Product
              </div>
              <div className="flex items-center gap-6 md:gap-8 lg:gap-16">
                <span className="w-12 md:w-16 text-sm md:text-base font-normal text-[#040404] uppercase">Price</span>
                <span className="w-16 md:w-20 text-sm md:text-base font-normal text-[#040404] uppercase">Quantity</span>
                <span className="w-12 md:w-16 text-sm md:text-base font-normal text-[#040404] uppercase">Total</span>
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Link 
                  href="/catalog" 
                  className="inline-block mt-4 px-6 py-3 bg-[#494791] text-white rounded hover:bg-[#494791]/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    index={index}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            )}

            {/* Shipping Info */}
            {cartItems.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-[#494791]/50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                  <div className="text-xs sm:text-sm md:text-base font-normal text-[#040404] uppercase">
                    shipping calculated at checkout
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 lg:gap-16">
                    <span className="text-xs sm:text-sm md:text-base font-bold text-[#040404] uppercase">Subtotal:</span>
                    <span className="text-xs sm:text-sm md:text-base font-bold text-[#040404] uppercase">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        {cartItems.length > 0 && (
          <div className="w-full xl:w-96">
            <div className="border border-[#A4A3C8] p-4 sm:p-6 flex flex-col gap-4 sticky top-4">
              {/* Free Shipping Progress */}
              <div className="text-center">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-lg text-black mb-4">
                    You&apos;re just ${remainingForFreeShipping.toFixed(2)} away from FREE shipping
                  </p>
                ) : (
                  <p className="text-lg text-[var(--color-green)] font-medium mb-4">
                    🎉 FREE SHIPPING
                  </p>
                )}
                <div className="relative w-full h-[3px] bg-[#D9D9D9] rounded">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#494791] rounded transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Special Notes */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg text-black">
                  Special notes for your order
                </h3>
                <div className="relative">
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full h-24 sm:h-32 p-3 border border-[#A4A3C8] resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#494791]/20"
                    placeholder="Add any special instructions..."
                  />
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-4 py-3 border border-[#A4A3C8] text-base focus:outline-none focus:ring-2 focus:ring-[#494791]/20"
                />
                <button
                  onClick={applyCoupon}
                  className="px-6 sm:px-10 py-3 border border-[#494791] text-base text-[#494791] hover:bg-[#494791] hover:text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-4">
                <span className="text-base font-bold text-[#040404] uppercase">Subtotal:</span>
                <span className="text-base font-bold text-[#040404] uppercase">${subtotal.toFixed(2)}</span>
              </div>


              {/* Checkout Button */}
              <button className="w-full py-4 bg-[#494791] border border-[#494791] text-base font-normal text-white uppercase hover:bg-[#494791]/90 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* You May Also Like Section */}
      {(recommendationsLoading || recommendedProducts.length > 0) && (
        <div className="py-16">
          <div className="flex flex-col gap-10">
            <h2 className="text-[40px] leading-[48px] font-normal text-[#040404] uppercase">
              you may also like
            </h2>
            
            {/* Responsive grid - 5 cards per row, wrapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
              {recommendationsLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`} />
                  ))
                : recommendedProducts.map((product) => (
                    <CartProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
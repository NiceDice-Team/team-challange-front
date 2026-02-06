"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { CustomBreadcrumb } from "../../../components/shared/CustomBreadcrumb";
import CartItem from "../../../components/cart/CartItem";
import CartProductCard from "../../../components/cart/CartProductCard";
import ProductCardSkeleton from "../../../components/catalog/ProductCardSkeleton";
import { useCartQuery, useUpdateCartQuantity, useRemoveFromCart } from "../../../hooks/useCartQuery";
import { productServices } from "../../../services/cartServices";
import CheckoutModal from "@/components/cart/CheckoutModal";

export default function CartPage() {
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveFromCart();

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      console.error("Recommendations API error:", err);
      setRecommendedProducts([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const removeItem = useCallback(
    async (cartItemId) => {
      try {
        await removeItemMutation.mutateAsync(cartItemId);
      } catch (err) {
        setError("Failed to remove item");
      }
    },
    [removeItemMutation]
  );

  const updateQuantity = useCallback(
    async (cartItemId, newQuantity) => {
      try {
        if (newQuantity <= 0) {
          await removeItemMutation.mutateAsync(cartItemId);
        } else {
          await updateQuantityMutation.mutateAsync({ cartItemId, quantity: newQuantity });
        }
      } catch (err) {
        setError("Failed to update quantity");
      }
    },
    [updateQuantityMutation, removeItemMutation]
  );

  const applyCoupon = () => {
    // Handle coupon application
    // TODO: Implement coupon logic
  };

  // Calculate totals
  const { subtotal, remainingForFreeShipping, shippingProgress } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(String(item.product?.price || 0));
      return sum + price * item.quantity;
    }, 0);

    const freeShippingThreshold = 60;
    const calculatedRemaining = Math.max(0, freeShippingThreshold - calculatedSubtotal);
    const calculatedProgress = Math.min(100, (calculatedSubtotal / freeShippingThreshold) * 100);

    return {
      subtotal: calculatedSubtotal,
      remainingForFreeShipping: calculatedRemaining,
      shippingProgress: calculatedProgress,
    };
  }, [cartItems]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board games", href: "/catalog" },
    { label: "Cart", href: "/cart", current: true },
  ];

  if (cartLoading) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto w-full max-w-[1320px]">
      {/* Error Message */}
      {error && <div className="bg-red-100 mb-4 px-4 py-3 border border-red-400 rounded text-red-700">{error}</div>}

      {/* Breadcrumb */}
      <div className="py-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Cart Header */}
      <div className="pb-6">
        <div className="flex flex-col gap-4">
          <h1 className="font-normal text-[#040404] lg:text-[40px] text-2xl sm:text-3xl uppercase leading-tight">
            your cart ({cartItems.length})
          </h1>

          <div className="flex sm:flex-row flex-col sm:items-center gap-2 text-base">
            <span className="text-black">Not ready to checkout?</span>
            <Link href="/catalog" className="flex items-center gap-1 text-black hover:text-[#494791] transition-colors">
              <span>Continue Shopping</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="#494791"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className={`flex flex-col xl:flex-row gap-8 lg:gap-16 ${cartItems.length === 0 ? "xl:justify-center" : ""}`}>
        {/* Main Cart Section */}
        <div
          className={`flex-1 ${
            cartItems.length === 0 ? "xl:max-w-none xl:flex-none xl:w-full" : "max-w-none xl:max-w-4xl"
          }`}
        >
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Table Headers - Hidden on mobile, only show when cart has items */}
            {cartItems.length > 0 && (
              <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-[#494791]/50 border-b">
                <div className="flex-1 font-normal text-[#040404] text-sm md:text-base uppercase">Product</div>
                <div className="flex items-center gap-6 md:gap-8 lg:gap-16">
                  <span className="w-12 md:w-16 font-normal text-[#040404] text-sm md:text-base uppercase">Price</span>
                  <span className="w-16 md:w-20 font-normal text-[#040404] text-sm md:text-base uppercase">
                    Quantity
                  </span>
                  <span className="w-12 md:w-16 font-normal text-[#040404] text-sm md:text-base uppercase">Total</span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Link
                  href="/catalog"
                  className="inline-block bg-[#494791] hover:bg-[#494791]/90 mt-4 px-6 py-3 text-white transition-colors"
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
              <div className="pt-4 sm:pt-6 border-[#494791]/50 border-t">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 sm:gap-4">
                  <div className="font-normal text-[#040404] text-xs sm:text-sm md:text-base uppercase">
                    shipping calculated at checkout
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 lg:gap-16">
                    <span className="font-bold text-[#040404] text-xs sm:text-sm md:text-base uppercase">
                      Subtotal:
                    </span>
                    <span className="font-bold text-[#040404] text-xs sm:text-sm md:text-base uppercase">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        {cartItems.length > 0 && (
          <div className="w-full xl:w-96">
            <div className="top-4 sticky flex flex-col gap-4 p-4 sm:p-6 border border-[#A4A3C8]">
              {/* Free Shipping Progress */}
              <div className="text-center">
                {remainingForFreeShipping > 0 ? (
                  <p className="mb-4 text-black text-lg">
                    You&apos;re just ${remainingForFreeShipping.toFixed(2)} away from FREE shipping
                  </p>
                ) : (
                  <p className="mb-4 font-medium text-[var(--color-green)] text-lg">🎉 FREE SHIPPING</p>
                )}
                <div className="relative bg-[#D9D9D9] rounded w-full h-[3px]">
                  <div
                    className="top-0 left-0 absolute bg-[#494791] rounded h-full transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Special Notes */}
              <div className="flex flex-col gap-4">
                <h3 className="text-black text-lg">Special notes for your order</h3>
                <div className="relative">
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="p-3 border border-[#A4A3C8] focus:outline-none focus:ring-[#494791]/20 focus:ring-2 w-full h-24 sm:h-32 text-sm resize-none"
                    placeholder="Add any special instructions..."
                  />
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex sm:flex-row flex-col gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-4 py-3 border border-[#A4A3C8] focus:outline-none focus:ring-[#494791]/20 focus:ring-2 text-base"
                />
                <button
                  onClick={applyCoupon}
                  className="hover:bg-[#494791] px-6 sm:px-10 py-3 border border-[#494791] text-[#494791] hover:text-white text-base transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-4">
                <span className="font-bold text-[#040404] text-base uppercase">Subtotal:</span>
                <span className="font-bold text-[#040404] text-base uppercase">${subtotal.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button className="bg-[#494791] hover:bg-[#494791]/90 py-4 border border-[#494791] w-full font-normal text-white text-base uppercase transition-colors"  
                onClick={() => setModalOpen(true)}>
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
            <h2 className="font-normal text-[#040404] text-[40px] uppercase leading-[48px]">you may also like</h2>

            {/* Responsive grid - 5 cards per row, wrapping */}
            <div className="justify-items-center gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {recommendationsLoading
                ? Array.from({ length: 5 }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)
                : recommendedProducts.map((product) => <CartProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      )}
    </div>

    {modalOpen && (
        <CheckoutModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
      </>
  );
}

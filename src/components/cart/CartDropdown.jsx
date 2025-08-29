"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useCartQuery, useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCartQuery";
import CartDropdownItem from "./CartDropdownItem";

export default function CartDropdown({
  isOpen,
  onClose,
}) {
  const dropdownRef = useRef(null);
  const { data: cartItems = [] } = useCartQuery();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveFromCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeItemMutation.mutateAsync(cartItemId);
      } else {
        await updateQuantityMutation.mutateAsync({ cartItemId, quantity: newQuantity });
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await removeItemMutation.mutateAsync(cartItemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Calculate totals with useMemo optimization
  const { subtotal, remainingForFreeShipping, shippingProgress } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || 0);
      return sum + price * item.quantity;
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed top-16 right-4 sm:right-6 lg:right-8 w-[min(90vw,424px)] bg-white border border-[#494791] shadow-[0px_202px_81px_rgba(0,0,0,0.01),0px_114px_68px_rgba(0,0,0,0.05),0px_51px_51px_rgba(0,0,0,0.09),0px_13px_28px_rgba(0,0,0,0.1)] z-50 max-h-[80vh] overflow-y-auto rounded-sm"
      >
        <div className="flex flex-col items-center p-4 gap-5">
          {/* Free Shipping Progress */}
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-center">
              {remainingForFreeShipping > 0 ? (
                <p className="text-sm sm:text-base lg:text-lg text-black font-normal leading-tight">
                  You&apos;re just ${remainingForFreeShipping.toFixed(2)} away from FREE shipping
                </p>
              ) : (
                <p className="text-sm sm:text-base lg:text-lg text-[#494791] font-medium">🎉 FREE SHIPPING</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full flex flex-col items-start gap-4">
              <div className="relative w-full h-[3px]">
                <div className="absolute inset-0 bg-[#D9D9D9]" />
                <div
                  className="absolute top-0 left-0 h-full bg-[#494791] transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="w-full text-center py-6 sm:py-8">
              <p className="text-black text-base sm:text-lg mb-4">Your cart is empty</p>
              <Link
                href="/catalog"
                onClick={onClose}
                className="inline-block px-6 py-3 bg-[#494791] text-white text-base font-normal uppercase hover:bg-[#494791]/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="w-full flex flex-col gap-4">
                {cartItems.map((item) => (
                  <CartDropdownItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              {/* Subtotal */}
              <div className="w-full border-t border-[#494791]/50 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-black font-normal uppercase">SUBTOTAL</span>
                  <span className="text-lg text-black font-normal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="w-full border-t border-[#494791]/50 mt-2" />
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-[#494791] text-[#494791] text-center text-sm sm:text-base font-normal uppercase hover:bg-[#494791]/5 transition-colors"
                >
                  View cart
                </Link>
                <button className="flex-1 py-3 px-4 bg-[#494791] border border-[#494791] text-white text-center text-sm sm:text-base font-normal uppercase hover:bg-[#494791]/90 transition-colors">
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

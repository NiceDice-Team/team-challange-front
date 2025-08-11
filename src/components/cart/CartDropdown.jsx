'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cartServices } from '@/services/cartServices';

export default function CartDropdown({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateCart, 
  onUpdateQuantity = null, 
  onRemoveItem = null 
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      if (onUpdateQuantity) {
        // Use optimistic update if available
        await onUpdateQuantity(cartItemId, newQuantity);
      } else {
        // Fallback to traditional approach
        if (newQuantity <= 0) {
          await removeItem(cartItemId);
          return;
        }
        await cartServices.updateCartItem(cartItemId, newQuantity);
        await onUpdateCart();
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      if (onRemoveItem) {
        // Use optimistic remove if available
        await onRemoveItem(cartItemId);
      } else {
        // Fallback to traditional approach
        await cartServices.removeFromCart(cartItemId);
        await onUpdateCart();
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  // Calculate totals (same logic as cart page)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + (price * item.quantity);
  }, 0);
  
  const freeShippingThreshold = 60;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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
                <p className="text-sm sm:text-base lg:text-lg text-[#494791] font-medium">
                  🎉 FREE SHIPPING
                </p>
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
                {cartItems.map((item, index) => {
                  const product = item.product || {};
                  const price = parseFloat(product.price || 0);
                  const imageUrl = product.images?.[0]?.url || '/placeholder.jpg';

                  return (
                    <div key={item.id} className="w-full flex items-start gap-2">
                      {/* Product Image */}
                      <div className="w-[72px] sm:w-[80px] md:w-[104px] h-[72px] sm:h-[80px] md:h-[104px] flex-shrink-0">
                        <Image 
                          src={imageUrl} 
                          alt={product.name || 'Product'}
                          width={104}
                          height={104}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-medium text-black uppercase leading-tight mb-2 line-clamp-2">
                            {product.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg font-medium text-black">
                            ${price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center border border-[#494791] bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#717171] hover:text-black"
                            >
                              <span className="text-sm sm:text-base">–</span>
                            </button>
                            <span className="px-2 sm:px-4 text-sm sm:text-base text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:text-[#494791]"
                            >
                              <span className="text-sm sm:text-base">+</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-4 h-4 flex items-center justify-center text-[#C41313] hover:text-red-700"
                            title="Remove item"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal */}
              <div className="w-full border-t border-[#494791]/50 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-black font-normal uppercase">
                    SUBTOTAL
                  </span>
                  <span className="text-lg text-black font-normal">
                    ${subtotal.toFixed(2)}
                  </span>
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
                <button
                  className="flex-1 py-3 px-4 bg-[#494791] border border-[#494791] text-white text-center text-sm sm:text-base font-normal uppercase hover:bg-[#494791]/90 transition-colors"
                >
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
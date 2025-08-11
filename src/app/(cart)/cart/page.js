'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CustomBreadcrumb } from '../../../components/shared/CustomBreadcrumb';
import CartProductCard from '../../../components/cart/CartProductCard';
import { cartServices, productServices } from '../../../services/cartServices';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart items and recommendations on component mount
  useEffect(() => {
    loadCartData();
    loadRecommendations();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const items = await cartServices.getCartItems();
      setCartItems(items);
    } catch (err) {
      console.error('Cart API error:', err);
      setError('Failed to load cart items. Using demo data.');
      // Fallback to mock data for development
      setCartItems([
        {
          id: 1,
          product: {
            id: 1,
            name: 'Ticket to ride: Europe',
            price: '35.99',
            images: [{ url: '/DynamicProduct/product_id_page_test_img_1.jpg' }],
            brand: { name: 'Asmodee' }
          },
          quantity: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const products = await productServices.getRandomProducts(5);
      setRecommendedProducts(products);
    } catch (err) {
      console.error('Recommendations API error:', err);
      // Fallback to mock data for development
      setRecommendedProducts([
        {
          id: 2,
          name: 'Ticket to Ride: Legacy',
          price: '34.99',
          original_price: '49.99',
          stars: '5.0',
          stock: 1,
          images: [{ url: '/New_Arrivals/New_arrivals_1.png' }],
          brand: { name: 'Asmodee' }
        },
        {
          id: 3,
          name: 'Ticket to Ride: Legacy',
          price: '34.99',
          stars: '5.0',
          stock: 10,
          images: [{ url: '/New_Arrivals/New_arrivals_2.png' }],
          brand: { name: 'Asmodee' }
        },
        {
          id: 4,
          name: 'Ticket to Ride: Legacy',
          price: '34.99',
          original_price: '49.99',
          stars: '4.0',
          stock: 5,
          images: [{ url: '/New_Arrivals/New_arrivals_3.png' }],
          brand: { name: 'Asmodee' }
        },
        {
          id: 5,
          name: 'Ticket to Ride: Legacy',
          price: '34.99',
          stars: '5.0',
          stock: 15,
          images: [{ url: '/New_Arrivals/New_arrivals_4.png' }],
          brand: { name: 'Asmodee' }
        },
        {
          id: 6,
          name: 'Ticket to Ride: Legacy',
          price: '34.99',
          original_price: '49.99',
          stars: '3.0',
          stock: 8,
          images: [{ url: '/ComingSoon/Img1.png' }],
          brand: { name: 'Asmodee' }
        }
      ]);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(cartItemId);
      return;
    }
    
    try {
      await cartServices.updateCartItem(cartItemId, newQuantity);
      
      // Refresh cart data to reflect changes
      await loadCartData();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartServices.removeFromCart(cartItemId);
      
      // Refresh cart data to reflect changes
      await loadCartData();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const applyCoupon = () => {
    // Handle coupon application
    // TODO: Implement coupon logic
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + (price * item.quantity);
  }, 0);
  
  const freeShippingThreshold = 60;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Board games', href: '/catalog' },
    { label: 'Cart', href: '/cart', current: true }
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <a href="/catalog" className="flex items-center gap-1 text-black hover:text-[#494791] transition-colors">
              <span>Continue Shopping</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#494791" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
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
                <a 
                  href="/catalog" 
                  className="inline-block mt-4 px-6 py-3 bg-[#494791] text-white rounded hover:bg-[#494791]/90 transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => {
                  const product = item.product || {};
                  const price = parseFloat(product.price || 0);
                  const imageUrl = product.images?.[0]?.url || '/placeholder.jpg';
                  const brandName = product.brand?.name || 'Unknown Brand';

                  return (
                    <div key={item.id}>
                      {/* Top Border Line - Add above each product entry */}
                      {index > 0 && (
                        <div className="w-full max-w-[824px] mx-auto h-0 border-t border-[#494791]/50 mb-4 sm:mb-6"></div>
                      )}
                      
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6">
                        {/* Product Info */}
                        <div className="flex items-start gap-2 sm:gap-4 flex-1">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 flex-shrink-0">
                            <Image 
                              src={imageUrl} 
                              alt={product.name || 'Product'}
                              width={192}
                              height={192}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
                            <div className="text-xs sm:text-sm md:text-base font-normal text-[#494791] uppercase">
                              {brandName}
                            </div>
                            <div className="text-xs sm:text-sm md:text-base font-normal text-black uppercase leading-tight">
                              {product.name || 'Unknown Product'}
                            </div>
                            {/* Mobile Price Display */}
                            <div className="md:hidden text-base sm:text-lg font-medium text-black">
                              ${price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Price, Quantity, Total - Desktop Layout */}
                        <div className="hidden md:flex items-start gap-4 md:gap-6 lg:gap-8 xl:gap-16">
                          {/* Price */}
                          <div className="w-12 md:w-16">
                            <span className="text-base md:text-lg font-normal text-black">
                              ${price.toFixed(2)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="w-16 md:w-20 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1 md:gap-2 border border-gray-300 rounded px-1 md:px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[#B3B3B3] hover:text-black"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="md:w-4 md:h-4">
                                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                              <span className="text-base md:text-lg font-normal text-black min-w-[1rem] md:min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-black hover:text-[#494791]"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="md:w-4 md:h-4">
                                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-1 text-xs md:text-sm text-[#717171] hover:text-black"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="md:w-3.5 md:h-3.5">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                              </svg>
                              Remove
                            </button>
                          </div>

                          {/* Total */}
                          <div className="w-12 md:w-16">
                            <span className="text-base md:text-lg font-normal text-black">
                              ${(price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Quantity Controls and Total */}
                        <div className="md:hidden flex items-center justify-between gap-2 sm:gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#B3B3B3] hover:text-black"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="sm:w-4 sm:h-4">
                                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                              <span className="text-base sm:text-lg font-normal text-black min-w-[1.5rem] sm:min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:text-[#494791]"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="sm:w-4 sm:h-4">
                                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-1 text-xs sm:text-sm text-[#717171] hover:text-black"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="sm:w-3.5 sm:h-3.5">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                              </svg>
                              Remove
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xs sm:text-sm text-gray-600">Total</div>
                            <div className="text-base sm:text-lg font-medium text-black">
                              ${(price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
      {recommendedProducts.length > 0 && (
        <div className="py-16">
          <div className="flex flex-col gap-10">
            <h2 className="text-[40px] leading-[48px] font-normal text-[#040404] uppercase">
              you may also like
            </h2>
            
            {/* Responsive grid - 5 cards per row, wrapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
              {recommendedProducts.map((product) => (
                <CartProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
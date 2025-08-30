"use client";

import React, { useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, CloseIcon } from "@/svgs/icons";

function CartItem({ item, index, updateQuantity, removeItem }) {
  const product = item.product || {};
  const price = parseFloat(product.price || 0);
  const imageUrl = product.images?.[0]?.url || "/FirstPlaceholder.svg";
  const brandName = product.brand?.name || "Unknown Brand";

  const handleDecreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity - 1);
  }, [item.id, item.quantity, updateQuantity]);

  const handleIncreaseQuantity = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, updateQuantity]);

  const handleRemoveItem = useCallback(() => {
    removeItem(item.id);
  }, [item.id, removeItem]);

  return (
    <div key={item.id}>
      {/* Top Border Line - Add above each product entry */}
      {index > 0 && <div className="w-full max-w-[824px] mx-auto h-0 border-t border-[#494791]/50 mb-4 sm:mb-6"></div>}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6">
        {/* Product Info */}
        <div className="flex items-start gap-2 sm:gap-4 flex-1">
          <Link href={`/product/${product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 flex-shrink-0 hover:opacity-75 transition-opacity">
            <Image
              src={imageUrl}
              alt={product.name || "Product"}
              width={192}
              height={192}
              className="w-full h-full object-cover "
            />
          </Link>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <div className="text-xs sm:text-sm md:text-base font-normal text-[#494791] uppercase">{brandName}</div>
            <Link href={`/product/${product.id}`} className="hover:text-[#494791] transition-colors">
              <div className="text-xs sm:text-sm md:text-base font-normal text-black uppercase leading-tight">
                {product.name || "Unknown Product"}
              </div>
            </Link>
            {/* Mobile Price Display */}
            <div className="md:hidden text-base sm:text-lg font-medium text-black">${price.toFixed(2)}</div>
          </div>
        </div>

        {/* Price, Quantity, Total - Desktop Layout */}
        <div className="hidden md:flex items-start gap-4 md:gap-6 lg:gap-8 xl:gap-16">
          {/* Price */}
          <div className="w-12 md:w-16">
            <span className="text-base md:text-lg font-normal text-black">${price.toFixed(2)}</span>
          </div>

          {/* Quantity Controls */}
          <div className="w-16 md:w-20 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 md:gap-2 border border-gray-300 rounded px-1 md:px-2 py-1">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                aria-label={`Decrease quantity of ${product.name || 'product'}`}
                className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[#B3B3B3] hover:text-black"
              >
                <MinusIcon className="md:w-4 md:h-4" />
              </button>
              <span className="text-base md:text-lg font-normal text-black min-w-[1rem] md:min-w-[1.5rem] text-center" aria-label={`Quantity: ${item.quantity}`}>
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                aria-label={`Increase quantity of ${product.name || 'product'}`}
                className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-black hover:text-[#494791]"
              >
                <PlusIcon className="md:w-4 md:h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemoveItem}
              aria-label={`Remove ${product.name || 'product'} from cart`}
              className="flex items-center gap-1 text-xs md:text-sm text-[#717171] hover:text-black"
            >
              <CloseIcon className="md:w-3.5 md:h-3.5" />
              Remove
            </button>
          </div>

          {/* Total */}
          <div className="w-12 md:w-16">
            <span className="text-base md:text-lg font-normal text-black">${(price * item.quantity).toFixed(2)}</span>
          </div>
        </div>

        {/* Mobile Quantity Controls and Total */}
        <div className="md:hidden flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                aria-label={`Decrease quantity of ${product.name || 'product'}`}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#B3B3B3] hover:text-black"
              >
                <MinusIcon className="sm:w-4 sm:h-4" />
              </button>
              <span className="text-base sm:text-lg font-normal text-black min-w-[1.5rem] sm:min-w-[2rem] text-center" aria-label={`Quantity: ${item.quantity}`}>
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                aria-label={`Increase quantity of ${product.name || 'product'}`}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:text-[#494791]"
              >
                <PlusIcon className="sm:w-4 sm:h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemoveItem}
              aria-label={`Remove ${product.name || 'product'} from cart`}
              className="flex items-center gap-1 text-xs sm:text-sm text-[#717171] hover:text-black"
            >
              <CloseIcon className="sm:w-3.5 sm:h-3.5" />
              Remove
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
            <div className="text-base sm:text-lg font-medium text-black">${(price * item.quantity).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartItem);

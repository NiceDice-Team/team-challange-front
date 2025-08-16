"use client";

import React, { useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@/svgs/icons";

function CartDropdownItem({ item, updateQuantity, removeItem }) {
  const product = item.product || {};
  const price = parseFloat(product.price || 0);
  const imageUrl = product.images?.[0]?.url || "/FirstPlaceholder.svg";

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
    <div className="w-full flex items-start gap-2">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="w-[72px] sm:w-[80px] md:w-[104px] h-[72px] sm:h-[80px] md:h-[104px] flex-shrink-0 hover:opacity-75 transition-opacity">
        <Image
          src={imageUrl}
          alt={product.name || "Product"}
          width={104}
          height={104}
          className="w-full h-full object-cover rounded"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/product/${product.id}`} className="hover:text-[#494791] transition-colors">
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-black uppercase leading-tight mb-2 line-clamp-2">
              {product.name || "Unknown Product"}
            </h3>
          </Link>
          <p className="text-sm sm:text-base md:text-lg font-medium text-black">${price.toFixed(2)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center border border-[#494791] bg-white">
            <button
              onClick={handleDecreaseQuantity}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#717171] hover:text-black"
              aria-label={`Decrease quantity of ${product.name || 'product'}`}
            >
              <span className="text-sm sm:text-base">–</span>
            </button>
            <span className="px-2 sm:px-4 text-sm sm:text-base text-black">{item.quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:text-[#494791]"
              aria-label={`Increase quantity of ${product.name || 'product'}`}
            >
              <span className="text-sm sm:text-base">+</span>
            </button>
          </div>

          <button
            onClick={handleRemoveItem}
            className="w-4 h-4 flex items-center justify-center text-[#C41313] hover:text-red-700"
            title="Remove item"
            aria-label={`Remove ${product.name || 'product'} from cart`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(CartDropdownItem);
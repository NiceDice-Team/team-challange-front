"use client";

import React, { useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@/svgs/icons";

function CartDropdownItem({ item, updateQuantity, removeItem }) {
  const product = item.product || {};
  const price = parseFloat(product.price || 0);
  const imageUrl = product.images?.[0]?.url_sm || "/FirstPlaceholder.svg";
  const stock = Number(product.stock);
  const isAtStockLimit = Number.isFinite(stock) && item.quantity >= stock;

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
              type="button"
              onClick={handleDecreaseQuantity}
              className="flex h-6 w-6 items-center justify-center text-[#717171] transition-colors duration-150 hover:bg-[var(--color-light-purple-3)] hover:text-black active:bg-[var(--color-light-purple)] sm:h-8 sm:w-8"
              aria-label={`Decrease quantity of ${product.name || 'product'}`}
            >
              <span className="text-sm sm:text-base">–</span>
            </button>
            <span className="px-2 sm:px-4 text-sm sm:text-base text-black">{item.quantity}</span>
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="flex h-6 w-6 items-center justify-center text-black transition-colors duration-150 hover:bg-[var(--color-light-purple-3)] hover:text-[#494791] active:bg-[var(--color-light-purple)] disabled:cursor-not-allowed disabled:bg-transparent disabled:text-[#B3B3B3] sm:h-8 sm:w-8"
              aria-label={`Increase quantity of ${product.name || 'product'}`}
              disabled={isAtStockLimit}
            >
              <span className="text-sm sm:text-base">+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemoveItem}
            className="flex h-5 w-5 items-center justify-center rounded-none text-[#C41313] transition-colors duration-150 hover:bg-[var(--color-error-border)] hover:text-[var(--color-red-price)] active:bg-[#ffd6db] active:text-[#9f1010]"
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

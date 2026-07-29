"use client";

import React, { useCallback, memo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner, TrashIcon } from "@/svgs/icons";
import type { CartItem } from "@/types/cart";

interface CartDropdownItemProps {
  item: CartItem;
  updateQuantity: (
    cartItemId: CartItem["id"],
    quantity: number,
  ) => void | Promise<void>;
  removeItem: (cartItemId: CartItem["id"]) => void | Promise<void>;
  isRemoving?: boolean;
}

function CartDropdownItem({
  item,
  updateQuantity,
  removeItem,
  isRemoving = false,
}: CartDropdownItemProps) {
  const product = item.product;
  const [quantityInput, setQuantityInput] = useState(String(item.quantity));
  const price = parseFloat(String(product.price || 0));
  const imageUrl = product.images?.[0]?.url_sm || "/FirstPlaceholder.svg";
  const stock = Number(product.stock);
  const maxQuantity = Number.isFinite(stock) ? stock : undefined;

  useEffect(() => {
    setQuantityInput(String(item.quantity));
  }, [item.quantity]);

  const clampQuantity = useCallback(
    (value: number) => {
      let next = Math.max(1, Math.floor(value));
      if (maxQuantity !== undefined) {
        next = Math.min(next, maxQuantity);
      }
      return next;
    },
    [maxQuantity],
  );

  const handleDecreaseQuantity = useCallback(() => {
    const current = Number(quantityInput);
    const base =
      Number.isFinite(current) && current >= 1 ? current : item.quantity;
    const next = base - 1;
    if (next > 0) {
      setQuantityInput(String(next));
    }
    updateQuantity(item.id, next);
  }, [item.id, item.quantity, quantityInput, updateQuantity]);

  const handleIncreaseQuantity = useCallback(() => {
    const current = Number(quantityInput);
    const base =
      Number.isFinite(current) && current >= 1 ? current : item.quantity;
    const next =
      maxQuantity !== undefined
        ? Math.min(base + 1, maxQuantity)
        : base + 1;
    setQuantityInput(String(next));
    updateQuantity(item.id, next);
  }, [item.id, item.quantity, maxQuantity, quantityInput, updateQuantity]);

  const isAtStockLimit =
    maxQuantity !== undefined &&
    (Number(quantityInput) || item.quantity) >= maxQuantity;
  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setQuantityInput(raw);

      if (raw.trim() === "") return;

      const value = Number(raw);
      if (!Number.isFinite(value) || value < 1) return;

      const clamped = clampQuantity(value);
      if (clamped !== value) {
        setQuantityInput(String(clamped));
      }
      if (clamped !== item.quantity) {
        updateQuantity(item.id, clamped);
      }
    },
    [clampQuantity, item.id, item.quantity, updateQuantity],
  );

  const handleQuantityBlur = useCallback(() => {
    const value = Number(quantityInput);
    if (!Number.isFinite(value) || value < 1) {
      setQuantityInput(String(item.quantity));
      return;
    }

    const clamped = clampQuantity(value);
    setQuantityInput(String(clamped));
    if (clamped !== item.quantity) {
      updateQuantity(item.id, clamped);
    }
  }, [clampQuantity, item.id, item.quantity, quantityInput, updateQuantity]);

  const handleRemoveItem = useCallback(() => {
    removeItem(item.id);
  }, [item.id, removeItem]);

  return (
    <div className="w-full flex items-start gap-2">
      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="w-[72px] sm:w-[80px] md:w-[104px] h-[72px] sm:h-[80px] md:h-[104px] flex-shrink-0 hover:opacity-75 transition-opacity"
      >
        <Image
          src={imageUrl}
          alt={product.name || "Product"}
          width={104}
          height={104}
          sizes="104px"
          className="w-full h-full object-cover rounded"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <Link
            href={`/product/${product.id}`}
            className="hover:text-[#494791] transition-colors"
          >
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-black uppercase leading-tight mb-2 line-clamp-2">
              {product.name || "Unknown Product"}
            </h3>
          </Link>
          <p className="text-sm sm:text-base md:text-lg font-medium text-black">
            ${price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center border border-[#494791] bg-white">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              className="flex h-6 w-6 items-center justify-center text-[#717171] transition-colors duration-150 hover:bg-[var(--color-light-purple-3)] hover:text-black active:bg-[var(--color-light-purple)] sm:h-8 sm:w-8"
              aria-label={`Decrease quantity of ${product.name || "product"}`}
            >
              <span className="text-sm sm:text-base">–</span>
            </button>
            <input
              type="number"
              min={1}
              max={maxQuantity}
              value={quantityInput}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              className="w-8 sm:w-10 px-1 sm:px-2 text-sm sm:text-base text-black text-center bg-transparent border-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label={`Quantity of ${product.name || "product"}`}
            />
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="flex h-6 w-6 items-center justify-center text-black transition-colors duration-150 hover:bg-[var(--color-light-purple-3)] hover:text-[#494791] active:bg-[var(--color-light-purple)] disabled:cursor-not-allowed disabled:bg-transparent disabled:text-[#B3B3B3] sm:h-8 sm:w-8"
              aria-label={`Increase quantity of ${product.name || "product"}`}
              disabled={isAtStockLimit}
            >
              <span className="text-sm sm:text-base">+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemoveItem}
            className="flex h-5 w-5 items-center justify-center rounded-none text-[#C41313] transition-colors duration-150 hover:bg-[var(--color-error-border)] hover:text-[var(--color-red-price)] active:bg-[#ffd6db] active:text-[#9f1010] disabled:cursor-wait disabled:hover:bg-transparent disabled:hover:text-[#C41313]"
            title={isRemoving ? "Removing item" : "Remove item"}
            aria-label={`${isRemoving ? "Removing" : "Remove"} ${product.name || "product"} from cart`}
            aria-busy={isRemoving}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(CartDropdownItem);

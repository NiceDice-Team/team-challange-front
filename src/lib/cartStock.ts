import type { CartItem } from "@/types/cart";

type CartProductLike = {
  id?: string | number;
  stock?: unknown;
} | null | undefined;

type CartItemLike = Pick<CartItem, "quantity"> & {
  id?: string | number;
  product?: CartProductLike;
};

export class CartStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartStockError";
  }
}

export function parseStockQuantity(stock: unknown): number | null {
  const parsedStock = Number(stock);

  if (!Number.isFinite(parsedStock) || parsedStock < 0) {
    return null;
  }

  return parsedStock;
}

export function getStockLimitMessage(stock: number): string {
  if (stock <= 0) {
    return "This product is out of stock.";
  }

  return `Only ${stock} unit${stock === 1 ? "" : "s"} available in stock.`;
}

export function idsMatch(firstId: string | number | undefined, secondId: string | number | undefined): boolean {
  if (firstId === undefined || secondId === undefined) {
    return false;
  }

  return String(firstId) === String(secondId);
}

export function getCartProductQuantity(
  cartItems: CartItemLike[],
  productId: string | number,
): number {
  return cartItems.reduce((totalQuantity, item) => {
    if (!idsMatch(item.product?.id, productId)) {
      return totalQuantity;
    }

    return totalQuantity + item.quantity;
  }, 0);
}

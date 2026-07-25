export const COMING_SOON_STOCK_VALUE = -1;

export type ProductAvailabilityStatus =
  | "coming-soon"
  | "sold-out"
  | "very-low"
  | "low"
  | "in-stock";

export interface ProductAvailability {
  status: ProductAvailabilityStatus;
  stockQuantity: number;
  isPurchasable: boolean;
}

export type AvailabilityMessageVariant = "range" | "exact" | "simple";

export function isComingSoonStock(stock: unknown): boolean {
  return Number(stock) === COMING_SOON_STOCK_VALUE;
}

export function getProductAvailability(stock: unknown): ProductAvailability {
  if (isComingSoonStock(stock)) {
    return {
      status: "coming-soon",
      stockQuantity: 0,
      isPurchasable: false,
    };
  }

  const parsedStock = Number(stock);

  if (!Number.isFinite(parsedStock) || parsedStock <= 0) {
    return {
      status: "sold-out",
      stockQuantity: 0,
      isPurchasable: false,
    };
  }

  if (parsedStock <= 5) {
    return {
      status: "very-low",
      stockQuantity: parsedStock,
      isPurchasable: true,
    };
  }

  if (parsedStock <= 10) {
    return {
      status: "low",
      stockQuantity: parsedStock,
      isPurchasable: true,
    };
  }

  return {
    status: "in-stock",
    stockQuantity: parsedStock,
    isPurchasable: true,
  };
}

export function getProductAvailabilityMessage(
  availability: ProductAvailability,
  variant: AvailabilityMessageVariant = "exact",
): string {
  const { status, stockQuantity } = availability;

  if (status === "coming-soon") {
    return "Coming soon";
  }

  if (status === "sold-out") {
    return "Sold out";
  }

  if (status === "very-low") {
    if (variant === "range") {
      return "Very low stock (1-5 units)";
    }

    return `Very low stock (${stockQuantity} unit${stockQuantity === 1 ? "" : "s"})`;
  }

  if (status === "low" && variant !== "simple") {
    return variant === "range"
      ? "Low stock (6-10 units)"
      : `Low stock (${stockQuantity} units)`;
  }

  return variant === "range" ? "In stock (11+ units)" : "In stock";
}

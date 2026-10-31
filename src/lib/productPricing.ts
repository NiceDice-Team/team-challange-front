export function getDiscountedPrice(
  price: unknown,
  discount: unknown,
): string | null {
  const priceValue = Number(price);
  const discountPercent = Number(discount);

  if (
    !Number.isFinite(priceValue) ||
    priceValue <= 0 ||
    !Number.isFinite(discountPercent) ||
    discountPercent <= 0 ||
    discountPercent > 100
  ) {
    return null;
  }

  const formattedPrice = priceValue.toFixed(2);
  const formattedDiscountedPrice = (
    priceValue *
    (1 - discountPercent / 100)
  ).toFixed(2);

  return Number(formattedDiscountedPrice) < Number(formattedPrice)
    ? formattedDiscountedPrice
    : null;
}

export function getEffectiveUnitPrice(
  price: unknown,
  discount?: unknown,
): number {
  const discountedPrice = getDiscountedPrice(price, discount);
  if (discountedPrice !== null) {
    return Number(discountedPrice);
  }

  const priceValue = Number(price);
  return Number.isFinite(priceValue) && priceValue > 0 ? priceValue : 0;
}

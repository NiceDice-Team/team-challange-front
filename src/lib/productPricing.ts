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

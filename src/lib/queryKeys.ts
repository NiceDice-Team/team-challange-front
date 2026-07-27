export const queryKeys = {
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  ordersByUser: (userId: string | number | null | undefined) =>
    ["orders", userId] as const,
  user: ["user"] as const,
  userDetail: (userId: string | number | null | undefined) =>
    ["user", userId] as const,
  products: {
    all: ["products"] as const,
    list: (filters: unknown) => ["products", filters] as const,
    detail: (productId: string | number | null | undefined) =>
      ["product", String(productId ?? "")] as const,
  },
  productReviews: {
    summary: (productId: string | number | null | undefined) =>
      ["product-reviews-summary", String(productId ?? "")] as const,
    list: (
      productId: string | number | null | undefined,
      sortBy?: string,
    ) => ["product-reviews", String(productId ?? ""), sortBy] as const,
    allForProduct: (productId: string | number | null | undefined) =>
      ["product-reviews", String(productId ?? "")] as const,
  },
  brands: {
    detail: (brandId: string | number | null | undefined) =>
      ["brand", brandId] as const,
  },
  catalog: {
    categories: ["categories"] as const,
    categoryCounts: (
      featuredCategoryIds: readonly number[],
      search: string | undefined,
    ) => ["category-counts", featuredCategoryIds, search] as const,
    audiences: ["audiences"] as const,
    gameTypes: ["game-types"] as const,
    brands: ["brands"] as const,
    priceBounds: (filters: unknown) => ["price-bounds", filters] as const,
  },
  checkout: {
    deliveryOptions: ["delivery-options"] as const,
    paymentMethods: ["payment-methods"] as const,
  },
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { catalogServices } from "@/services/catalogServices";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";

const PRODUCT_STALE_TIME = 15 * 60 * 1000;
const PRODUCT_GC_TIME = 60 * 60 * 1000;
const BRAND_STALE_TIME = 24 * 60 * 60 * 1000;

interface ProductQueryOptions {
  enabled?: boolean;
}

export function useProductQuery(
  productId: string | number | null | undefined,
  options: ProductQueryOptions = {},
) {
  const normalizedProductId = productId ? String(productId) : "";

  return useQuery({
    queryKey: queryKeys.products.detail(normalizedProductId),
    queryFn: ({ signal }) =>
      productServices.getProductById(normalizedProductId, { signal }),
    enabled: Boolean(normalizedProductId) && (options.enabled ?? true),
    staleTime: PRODUCT_STALE_TIME,
    gcTime: PRODUCT_GC_TIME,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

export function useProductReviewsSummaryQuery(
  productId: string | number | null | undefined,
  options: ProductQueryOptions = {},
) {
  const normalizedProductId = productId ? String(productId) : "";

  return useQuery({
    queryKey: queryKeys.productReviews.summary(normalizedProductId),
    queryFn: ({ signal }) =>
      reviewServices.getAllProductReviews(normalizedProductId, {}, { signal }),
    enabled: Boolean(normalizedProductId) && (options.enabled ?? true),
    staleTime: PRODUCT_STALE_TIME,
    gcTime: PRODUCT_GC_TIME,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

export function useBrandQuery(
  brandId: string | number | null | undefined,
  options: ProductQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.brands.detail(brandId),
    queryFn: ({ signal }) => catalogServices.getBrandById(brandId as number, { signal }),
    enabled: brandId !== null && brandId !== undefined && (options.enabled ?? true),
    staleTime: BRAND_STALE_TIME,
    gcTime: BRAND_STALE_TIME,
    retry: 1,
  });
}

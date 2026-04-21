"use client";
import { useQuery } from "@tanstack/react-query";
import { productServices } from "../../services/productServices";
import { reviewServices } from "@/services/reviewServices";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { ProductAccordion } from "./ProductPageAccordion";
import { CustomBreadcrumb } from "../shared/CustomBreadcrumb";
import { useAddToCart } from "@/hooks/useCartQuery";
import {
  CircleChevronLeft,
  CircleChevronRight,
  HeartEmptyIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
} from "@/svgs/icons";
import StarsLine from "../layout/StarsLine";
import { calculateAverageRating, normalizeReviewRating } from "@/lib/reviewMetrics";

// Component props
interface ProductPageProps {
  params: {
    id: string;
  };
}

// Stock status types
interface StockStatus {
  message: string;
  color: string;
  status: 'sold-out' | 'very-low' | 'low' | 'in-stock';
}

export default function ProductPage({ params }: ProductPageProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const addToCartMutation = useAddToCart();

  const productId = params?.id;
  const isInvalidId = productId === "[object Object]";

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => productServices.getProductById(productId, { signal }),
    enabled: !!productId && !isInvalidId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["product-reviews-summary", productId],
    queryFn: ({ signal }) => reviewServices.getAllProductReviews(productId, {}, { signal }),
    enabled: !!productId && !isInvalidId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const breadcrumbItems = useMemo(
    () => [
      { label: t("product.breadcrumb.home"), href: "/" },
      { label: t("product.breadcrumb.boardGames"), href: "/catalog" },
      { label: product?.name || t("product.breadcrumb.fallbackName"), current: true },
    ],
    [t, product?.name],
  );

  // Handle invalid product ID redirect
  useEffect(() => {
    if (isInvalidId) {
      console.warn("Invalid product ID received, redirecting...");
      window.location.href = "/catalog";
    }
  }, [isInvalidId]);

  // Show nothing while redirecting
  if (isInvalidId) {
    return null;
  }

  // If no product ID, show error
  if (!productId) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-red-500 text-base sm:text-lg">{t("product.errors.invalidId")}</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">{t("product.errors.invalidUrlHint")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="space-y-4 sm:space-y-6">
            <div className="h-6 sm:h-8 bg-gray-200 animate-pulse"></div>
            <div className="h-5 sm:h-6 bg-gray-200 animate-pulse w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-red-500 text-base sm:text-lg">{t("product.errors.loadFailed")}</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">{t("product.errors.loadFailedHint")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <p className="text-gray-500 text-base sm:text-lg">{t("product.errors.notFound")}</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (addToCartMutation.isPending) return; // Prevent multiple rapid clicks

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: quantity,
        productData: product,
      });
    } catch {
      // Error feedback is handled in the cart mutation hook.
    }
  };

  const stockQuantity = parseInt(product.stock) || 0;
  const isInStock = stockQuantity > 0;

  // Determine stock status based on quantity
  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) {
      return {
        message: t("product.stock.soldOut"),
        color: "var(--color-gray-2)",
        status: "sold-out",
      };
    } else if (stock >= 1 && stock <= 5) {
      return {
        message: t("product.stock.veryLow", {
          count: stock,
          units: stock === 1 ? t("product.stock.unit") : t("product.stock.units"),
        }),
        color: "var(--color-red-stock)",
        status: "very-low",
      };
    } else if (stock >= 6 && stock <= 10) {
      return {
        message: t("product.stock.low", { count: stock }),
        color: "var(--color-orange)",
        status: "low",
      };
    } else {
      return {
        message: t("product.stock.inStock"),
        color: "var(--color-green)",
        status: "in-stock",
      };
    }
  };

  const stockStatus = getStockStatus(stockQuantity);

  const discountPrice =
    product.discount && parseFloat(product.discount) > 0
      ? (parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2)
      : null;

  const fetchedReviewCount = reviewsData?.count ?? 0;
  const reviewCount = fetchedReviewCount || (Array.isArray(product.reviews) ? product.reviews.length : 0);
  const averageRating =
    fetchedReviewCount > 0
      ? calculateAverageRating(reviewsData?.results ?? [])
      : normalizeReviewRating(product.stars ?? 0);
  const rating = Math.round(averageRating);
  const currentImage = product?.images?.[selectedImageIndex];
  const currentImageSrc = currentImage?.url_lg || currentImage?.url_md || currentImage?.url_sm;
  const imageCount = product?.images?.length || 0;
  const hasMultipleImages = imageCount > 1;
  const shortDescription = product.description || t("product.descriptionUnavailable");

  const handleQuantityChange = (nextQuantity: number) => {
    if (!isInStock) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.max(1, Math.min(stockQuantity, nextQuantity)));
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 pt-0 pb-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12 xl:px-16">
      <div className="sm:hidden">
        <div className="mx-auto max-w-[396px] border-b border-[var(--color-light-purple-2)] py-6">
          <div className="w-full overflow-x-auto no-scrollbar">
            <CustomBreadcrumb
              items={breadcrumbItems}
              className="w-max"
              listClassName="gap-2"
              linkClassName="text-base leading-[19px]"
              pageClassName="text-base leading-[19px]"
              separatorClassName="mx-0"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[380px] overflow-hidden bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
          <div className="relative isolate flex flex-col items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsFavorite((prev) => !prev)}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
              aria-label={t("product.wishlistAria")}
            >
              {isFavorite ? <HeartFilledIcon className="h-4 w-4" /> : <HeartEmptyIcon className="h-4 w-4" />}
            </button>

            <div className="relative h-[275px] w-full">
              {currentImageSrc ? (
                <Image
                  src={currentImageSrc}
                  alt={currentImage?.alt || product?.name || t("product.imageAltProduct")}
                  fill
                  className="object-contain"
                  priority
                  unoptimized={currentImageSrc.includes("placehold.co")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                  {t("product.noImage")}
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="mx-auto flex w-full max-w-[240px]">
                {product.images.map((image, index) => (
                  <button
                    key={image.id || index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-[3px] flex-1 border-0 ${
                      selectedImageIndex === index ? "bg-[var(--color-purple)]" : "bg-[var(--color-light-purple-2)]"
                    }`}
                    aria-label={t("product.viewImageAria", { number: index + 1 })}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-3 text-sm uppercase">
              <span className="text-[var(--color-purple)]">{product.brand || t("product.brandFallback")}</span>
              <span className="text-[var(--color-gray-2)]">
                {t("product.skuLabel")} {product.id.toString().padStart(6, "0")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-base font-medium leading-[19px] uppercase text-black">{product.name}</h1>

              <div className="flex items-center gap-1">
                <StarsLine rating={rating} />
                <span className="text-base leading-[19px] text-black">({reviewCount})</span>
              </div>
            </div>

            <p
              className="text-base leading-[140%] text-black"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 6,
                overflow: "hidden",
              }}
            >
              {shortDescription}
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                {discountPrice ? (
                  <>
                    <span className="text-xl font-bold leading-6 text-[var(--color-red-price)]">${discountPrice}</span>
                    <span className="text-base leading-[19px] text-[var(--color-gray-2)] line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold leading-6 text-black">${product.price}</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm leading-[17px]" style={{ color: stockStatus.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stockStatus.color }} />
                <span>{stockStatus.message}</span>
              </div>
            </div>

            <div className="grid grid-cols-[153px_minmax(0,1fr)] gap-4">
              <div className="flex h-12 items-center justify-between border border-[var(--color-purple)] px-6">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={!isInStock || quantity <= 1}
                  className="flex h-6 w-6 items-center justify-center text-[var(--color-gray-2)] disabled:opacity-40"
                  aria-label={t("product.quantity.decreaseAria")}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>

                <span className="text-base leading-[19px] text-black">{quantity}</span>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!isInStock || quantity >= stockQuantity}
                  className="flex h-6 w-6 items-center justify-center text-black disabled:opacity-40"
                  aria-label={t("product.quantity.increaseAria")}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addToCartMutation.isPending}
                className={`flex h-12 items-center justify-center px-8 text-base font-medium uppercase text-white transition-colors ${
                  isInStock && !addToCartMutation.isPending
                    ? "bg-[var(--color-purple)] hover:opacity-90"
                    : "cursor-not-allowed bg-gray-400"
                }`}
              >
                {addToCartMutation.isPending ? t("product.addingToCart") : t("product.addToCart")}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[396px] border-t border-[var(--color-light-purple-2)]">
          <ProductAccordion accordionParams={product} defaultValue={["description", "delivery"]} />
        </div>
      </div>

      <div className="hidden sm:block">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Product Image Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative mx-auto flex w-full max-w-full items-center sm:max-w-[500px] lg:max-w-[600px]">
              <button
                onClick={() =>
                  setSelectedImageIndex(selectedImageIndex === 0 ? imageCount - 1 : selectedImageIndex - 1)
                }
                className="flex-shrink-0 p-1 transition-opacity hover:opacity-80 sm:p-0"
                disabled={!hasMultipleImages || selectedImageIndex === 0}
              >
                <CircleChevronLeft
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  disabled={!hasMultipleImages || selectedImageIndex === 0}
                />
              </button>

              <div className="relative aspect-square flex-1">
                {currentImageSrc ? (
                  <Image
                    src={currentImageSrc}
                    alt={currentImage?.alt || product?.name || t("product.imageAltProduct")}
                    fill
                    className="object-contain"
                    priority
                    unoptimized={currentImageSrc.includes("placehold.co")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                    {t("product.noImage")}
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  setSelectedImageIndex(selectedImageIndex === imageCount - 1 ? 0 : selectedImageIndex + 1)
                }
                className="flex-shrink-0 p-1 transition-opacity hover:opacity-80 sm:p-0"
                disabled={!hasMultipleImages || selectedImageIndex === imageCount - 1}
              >
                <CircleChevronRight
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  disabled={!hasMultipleImages || selectedImageIndex === imageCount - 1}
                />
              </button>
            </div>

            <div className="mx-auto flex max-w-full gap-1 overflow-x-auto pb-2 sm:max-w-[500px] sm:gap-2 lg:max-w-[600px]">
              {product?.images?.map((image, index) => (
                <div
                  key={image.id || index}
                  className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden transition-opacity sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-[104px] lg:w-[104px] ${
                    selectedImageIndex === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.url_sm}
                    alt={image.alt || t("product.imageAltNumbered", { number: index + 1 })}
                    fill
                    className="object-contain p-1"
                    unoptimized={image.url_sm?.includes("placehold.co")}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            <div>
              <div className="mb-2 flex flex-col gap-1 text-sm uppercase text-[var(--color-purple)] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-base lg:text-lg">
                {product.brand && <span>{product.brand}</span>}
                <span className="text-xs text-[var(--color-gray-2)] sm:text-sm lg:text-base">
                  {t("product.skuLabel")} {product.id.toString().padStart(6, "0")}
                </span>
              </div>

              <h1 className="text-xl leading-tight uppercase text-black sm:text-2xl md:text-3xl lg:text-[40px]">
                {product.name}
              </h1>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="flex items-baseline gap-2 sm:gap-3">
                {discountPrice ? (
                  <>
                    <span className="text-xl font-bold text-red-600 sm:text-2xl lg:text-3xl">${discountPrice}</span>
                    <span className="text-base text-gray-500 line-through sm:text-lg lg:text-xl">${product.price}</span>
                  </>
                ) : (
                  <span className="text-2xl text-black sm:text-3xl md:text-4xl lg:text-5xl">${product.price}</span>
                )}
              </div>
            </div>

            <div className="flex flex-nowrap items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stockStatus.color }} />
              <span className="text-sm sm:text-base" style={{ color: stockStatus.color }}>
                {stockStatus.message}
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center justify-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 text-lg text-gray-600 hover:bg-gray-100 sm:p-2.5 sm:text-base"
                    disabled={!isInStock}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={isInStock ? stockQuantity : 1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    disabled={!isInStock}
                    className="w-12 border-0 py-2 text-center text-base focus:outline-none disabled:bg-gray-50 sm:w-16"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 text-lg text-gray-600 hover:bg-gray-100 sm:p-2.5 sm:text-base"
                    disabled={!isInStock || quantity >= stockQuantity}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addToCartMutation.isPending}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-white transition-colors sm:px-6 sm:text-base ${
                    isInStock && !addToCartMutation.isPending
                      ? "bg-[color:var(--color-purple)] hover:opacity-90"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  {addToCartMutation.isPending ? t("product.addingToCartDesktop") : t("product.addToCartDesktop")}
                </button>
              </div>
            </div>

            <ProductAccordion accordionParams={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

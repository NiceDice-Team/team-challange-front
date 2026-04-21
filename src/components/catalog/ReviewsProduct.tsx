"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import StarRating from "../layout/StarsLine";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";
import ProductReviewDialog from "./ProductReviewDialog";
import { calculateAverageRating, normalizeReviewRating } from "@/lib/reviewMetrics";

interface ReviewsProductProps {
  productId: string;
  children?: React.ReactNode;
}

const STAR_DISTRIBUTION = [5, 4, 3, 2, 1];

export default function ReviewsProduct({ productId, children }: ReviewsProductProps) {
  const { t } = useTranslation();

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => productServices.getProductById(productId, { signal }),
    enabled: !!productId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["product-reviews-summary", productId],
    queryFn: ({ signal }) => reviewServices.getAllProductReviews(productId, {}, { signal }),
    enabled: !!productId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const fetchedReviewCount = reviewsData?.count ?? 0;
  const reviewCount = fetchedReviewCount || (Array.isArray(product?.reviews) ? product.reviews.length : 0);
  const averageRating =
    fetchedReviewCount > 0
      ? calculateAverageRating(reviewsData?.results ?? [])
      : normalizeReviewRating(product?.stars ?? 0);
  const roundedRating = Math.round(averageRating);

  const basedOnText = useMemo(
    () =>
      reviewCount === 1
        ? t("product.reviews.basedOn_one", { count: reviewCount })
        : t("product.reviews.basedOn_other", { count: reviewCount }),
    [t, reviewCount],
  );

  const ratingDistribution = useMemo(() => {
    const counts = new Map<number, number>(STAR_DISTRIBUTION.map((star) => [star, 0]));

    for (const review of reviewsData?.results ?? []) {
      const normalizedRating = Math.round(normalizeReviewRating(review.rating));

      if (normalizedRating >= 1 && normalizedRating <= 5) {
        counts.set(normalizedRating, (counts.get(normalizedRating) ?? 0) + 1);
      }
    }

    return STAR_DISTRIBUTION.map((star) => {
      const count = counts.get(star) ?? 0;

      return {
        star,
        count,
        progress: reviewCount > 0 ? (count / reviewCount) * 100 : 0,
      };
    });
  }, [reviewCount, reviewsData?.results]);

  return (
    <>
      <section className="sm:hidden mx-auto mt-10 w-full max-w-[428px] px-4">
        {children}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-center text-xl uppercase text-[#040404]">{t("product.reviews.sectionTitle")}</h2>

          <div className="flex w-full items-center justify-between gap-4 px-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <StarRating rating={roundedRating} />
                <span className="text-base uppercase text-[var(--color-purple)] underline underline-offset-2">
                  {t("product.reviews.ratingOutOf", { rating: averageRating.toFixed(2) })}
                </span>
              </div>
              <span className="text-base text-black">{basedOnText}</span>
            </div>

            <ProductReviewDialog
              productId={productId}
              productName={product?.name}
              buttonClassName="flex h-12 items-center justify-center bg-[var(--color-purple)] px-8 text-base uppercase text-white"
            />
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[var(--color-light-purple-2)]" />
      </section>

      <section className="hidden max-w-[1320px] mx-auto mb-6 px-4 sm:flex sm:flex-col sm:items-center sm:justify-center sm:px-6 sm:mb-8 md:mb-10 md:px-8 lg:px-12 xl:px-16">
        {children}
        <div className="mx-auto mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-center text-xl uppercase sm:text-2xl md:text-3xl lg:text-[40px]">
            {t("product.reviews.sectionTitle")}
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
          <div className="flex flex-col items-center justify-center border-b-2 border-[var(--color-purple)]/50 pb-6 md:border-b-0 md:border-r-2 md:pb-0">
            <div className="flex flex-nowrap items-center gap-1">
              <StarRating rating={roundedRating} />
              <span className="text-sm text-[var(--color-purple)] underline underline-offset-3 underline-[var(--color-purple)] sm:text-base">
                {t("product.reviews.ratingOutOf", { rating: averageRating.toFixed(2) })}
              </span>
            </div>
            <span className="text-sm sm:text-base">{basedOnText}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 py-4 md:py-0">
            {ratingDistribution.map(({ star, count, progress }) => (
              <div key={star} className="flex flex-nowrap items-center justify-center gap-2">
                <StarRating rating={star} />
                <progress
                  id="rating"
                  max="100"
                  value={progress}
                  className="max-h-2 w-16 [&::-moz-progress-bar]:bg-[#494791] [&::-webkit-progress-bar]:bg-[#D9D9D9] [&::-webkit-progress-value]:bg-[#494791] sm:w-20 md:max-w-[88px]"
                  style={{
                    backgroundColor: "#D9D9D9",
                  }}
                ></progress>
                <span className="text-sm sm:text-base">{count}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center border-t-2 border-[var(--color-purple)]/50 pt-6 md:border-t-0 md:border-l-2 md:pt-0">
            <ProductReviewDialog
              productId={productId}
              productName={product?.name}
              buttonClassName="bg-[var(--color-purple)] px-4 py-2 text-sm uppercase text-white transition-opacity hover:opacity-90 sm:text-base"
            />
          </div>
        </div>
      </section>
    </>
  );
}

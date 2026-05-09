"use client";
import SubscribeSection from "../home/SubscribeSection";
import ReviewCard from "../home/ReviewCard";
import { Pagination } from "../ui/pagination";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { CustomSelect } from "../shared/CustomSelect";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";

const REVIEWS_PER_PAGE = 2;
const SORT_TO_ORDERING: Record<string, string> = {
  "most-recent": "-created_at",
  oldest: "created_at",
  "highest-rated": "-rating",
  "lowest-rated": "rating",
};

interface ReviewsCommentsProps {
  productId: string;
  children?: React.ReactNode;
}

const formatReviewDate = (value?: string): string | undefined => {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normalizeRating = (value: string | number | undefined): number => {
  const parsed = Number(value ?? 0);
  return Math.max(0, Math.min(5, Math.round(Number.isFinite(parsed) ? parsed : 0)));
};

export default function ReviewsComments({ productId, children }: ReviewsCommentsProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("most-recent");

  const sortOptionsMobile = useMemo(
    () => [
      { value: "most-recent", label: t("product.reviews.sortMostRecent") },
      { value: "oldest", label: t("product.reviews.sortOldest") },
      { value: "highest-rated", label: t("product.reviews.sortHighestRated") },
      { value: "lowest-rated", label: t("product.reviews.sortLowestRated") },
    ],
    [t],
  );

  const sortOptionsDesktop = useMemo(
    () => [
      { value: "most-recent", label: t("product.reviews.sortMostRecentDesktop") },
      { value: "oldest", label: t("product.reviews.sortOldest") },
      { value: "highest-rated", label: t("product.reviews.sortHighestRatedDesktop") },
      { value: "lowest-rated", label: t("product.reviews.sortLowestRatedDesktop") },
    ],
    [t],
  );

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

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-reviews", productId, sortBy],
    queryFn: ({ signal }) =>
      reviewServices.getAllProductReviews(
        productId,
        { ordering: SORT_TO_ORDERING[sortBy] ?? "-created_at" },
        { signal }
      ),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const normalizedReviews = useMemo(() => {
    return (reviewsData?.results ?? []).map((review) => {
      const normalizedRating = normalizeRating(review.rating);
      const comment = review.comment?.trim();

      return {
        rating: normalizedRating,
        date: formatReviewDate(review.created_at),
        avatarSrc: undefined,
        name: review.user_id
          ? t("product.reviews.customerNumber", { id: review.user_id })
          : t("product.reviews.anonymousCustomer"),
        aboutHref: product?.name ? `/product/${productId}` : undefined,
        aboutText: product?.name,
        title: comment
          ? t("product.reviews.cardTitleWithComment", { rating: normalizedRating })
          : t("product.reviews.cardTitleWithoutComment", { rating: normalizedRating }),
        body: comment || t("product.reviews.cardBodyNoComment"),
        images: [],
      };
    });
  }, [product?.name, productId, reviewsData?.results, t]);

  const totalPages = Math.ceil(normalizedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = normalizedReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string): void => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <>
      <section className="sm:hidden mx-auto w-full max-w-[428px] px-4">
        <div className="flex items-center gap-4">
          <span className="text-[18px] font-medium leading-[22px] uppercase text-black">{t("product.reviews.sortBy")}</span>
          <CustomSelect
            className="!h-6 !min-w-0 !w-auto border-0 px-0 py-0 text-base font-normal text-[var(--color-purple)] shadow-none [&_svg]:!ml-2 [&_svg]:h-6 [&_svg]:w-6"
            placeholder={t("product.reviews.placeholderSort")}
            value={sortBy}
            onValueChange={handleSortChange}
            options={sortOptionsMobile}
          />
        </div>

        <div className="mt-6 flex flex-col">
          {isLoading && (
            <div className="border-t border-[var(--color-light-purple-2)] px-6 py-6 text-base text-gray-500">
              {t("product.reviews.loadingReviews")}
            </div>
          )}

          {!isLoading && error && (
            <div className="border-t border-[var(--color-light-purple-2)] px-6 py-6 text-base text-red-500">
              {t("product.reviews.loadReviewsError")}
            </div>
          )}

          {!isLoading && !error && currentReviews.length === 0 && (
            <div className="border-t border-[var(--color-light-purple-2)] px-6 py-6 text-base text-gray-500">
              {t("product.reviews.noReviewsYet")}
            </div>
          )}

          {!isLoading &&
            !error &&
            currentReviews.map((review, idx) => (
              <ReviewCard
                className="border-t border-[var(--color-light-purple-2)] px-6 py-6 first:border-t-0"
                key={startIndex + idx}
                {...review}
                collapsible={true}
              />
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className="gap-4" />
          </div>
        )}
      </section>

      <section className="hidden w-full max-w-[1320px] grid-cols-1 items-start gap-6 px-4 sm:grid sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm font-medium uppercase sm:text-base lg:text-lg">{t("product.reviews.sortByDesktop")}</span>
            <CustomSelect
              className="h-auto border-0"
              placeholder={t("product.reviews.placeholderSortDesktop")}
              value={sortBy}
              onValueChange={handleSortChange}
              options={sortOptionsDesktop}
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            {isLoading && (
              <div className="border-t-2 border-[color:var(--color-light-purple)] py-6 text-base text-gray-500">
                {t("product.reviews.loadingReviews")}
              </div>
            )}

            {!isLoading && error && (
              <div className="border-t-2 border-[color:var(--color-light-purple)] py-6 text-base text-red-500">
                {t("product.reviews.loadReviewsError")}
              </div>
            )}

            {!isLoading && !error && currentReviews.length === 0 && (
              <div className="border-t-2 border-[color:var(--color-light-purple)] py-6 text-base text-gray-500">
                {t("product.reviews.noReviewsYet")}
              </div>
            )}

            {!isLoading &&
              !error &&
              currentReviews.map((review, idx) => (
                <ReviewCard
                  className="border-t-2 border-[color:var(--color-light-purple)]"
                  key={startIndex + idx}
                  {...review}
                  collapsible={true}
                />
              ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center sm:mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>

        <div className="mt-6 lg:mt-0">
          <SubscribeSection className="px-6 py-20 sm:px-10 sm:py-28 lg:px-14 lg:py-40" />
        </div>
      </section>
    </>
  );
}

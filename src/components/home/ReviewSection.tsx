"use client";

import { useMemo, useRef, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import ReviewCard from "../../components/home/ReviewCard";
import { queryKeys } from "@/lib/queryKeys";
import { getReviewAuthorName } from "@/lib/reviewAuthor";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";
import type { ProductReviewApi } from "@/types/review";

interface Review {
  id: number;
  rating: number;
  date?: string;
  name: string;
  aboutHref?: string;
  aboutText?: string;
  title: string;
  body: string;
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

const mapReview = (review: ProductReviewApi, productName?: string): Review => {
  const rating = normalizeRating(review.rating);
  const comment = review.comment?.trim();

  return {
    id: review.id,
    rating,
    date: formatReviewDate(review.created_at),
    name: getReviewAuthorName(review),
    aboutHref: review.product_id ? `/product/${review.product_id}` : undefined,
    aboutText: productName,
    title: comment ? `Rated ${rating} out of 5` : `Rating: ${rating} out of 5`,
    body: comment || "This customer left a star rating without a written comment.",
  };
};

interface ArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const PrevArrow = ({ className = "", ...rest }: ArrowProps) => (
  <button
    aria-label="Previous reviews"
    className={`h-10 w-10 rounded-full transition hover:scale-105 focus:outline-none disabled:cursor-not-allowed ${className}`}
    {...rest}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="40"
        y="40"
        width="40"
        height="40"
        rx="20"
        transform="rotate(-180 40 40)"
        fill="#494791"
        fillOpacity={rest.disabled ? "0.5" : "1"}
      />
      <path
        d="M24.1215 10.6921L25.1855 11.7561L16.9405 20.0001L25.1855 28.2441L24.1215 29.3081L14.8135 20.0001L24.1215 10.6921Z"
        fill="white"
      />
    </svg>
  </button>
);

const NextArrow = ({ className = "", ...rest }: ArrowProps) => (
  <button
    aria-label="Next reviews"
    className={`h-10 w-10 rounded-full transition hover:scale-105 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...rest}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill="#494791" />
      <path
        d="M15.8785 29.3079L14.8145 28.2439L23.0595 19.9999L14.8145 11.7559L15.8785 10.6919L25.1865 19.9999L15.8785 29.3079Z"
        fill="white"
      />
    </svg>
  </button>
);

const DESKTOP_PAGE_SIZE = 3;
const HOME_REVIEWS_LIMIT = 6;
const SWIPE_THRESHOLD_PX = 48;
const EMPTY_REVIEWS: ProductReviewApi[] = [];

export default function ReviewSection() {
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.reviews.all,
    queryFn: ({ signal }) => reviewServices.getReviews({ signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const reviewResults = useMemo(
    () => (reviewsData?.results ?? EMPTY_REVIEWS).slice(0, HOME_REVIEWS_LIMIT),
    [reviewsData?.results],
  );
  const productIds = useMemo(
    () => [...new Set(reviewResults.flatMap((review) => (review.product_id ? [review.product_id] : [])))],
    [reviewResults],
  );

  const productQueries = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: queryKeys.products.detail(productId),
      queryFn: ({ signal }: { signal: AbortSignal }) => productServices.getProductById(productId, { signal }),
      staleTime: 15 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 1,
    })),
  });

  const data = useMemo(() => {
    const productNameById = new Map<number, string>();

    productQueries.forEach((query) => {
      if (query.data?.id && query.data.name) {
        productNameById.set(query.data.id, query.data.name);
      }
    });

    return reviewResults.map((review) =>
      mapReview(review, review.product_id ? productNameById.get(review.product_id) : undefined),
    );
  }, [productQueries, reviewResults]);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  const maxDesktopPage = Math.max(
    0,
    Math.ceil(data.length / DESKTOP_PAGE_SIZE) - 1,
  );
  const maxMobilePage = Math.max(0, data.length - 1);
  const desktopSliceStart = desktopPage * DESKTOP_PAGE_SIZE;
  const visibleDesktop = data.slice(
    desktopSliceStart,
    desktopSliceStart + DESKTOP_PAGE_SIZE,
  );
  const visibleMobileReview = data[Math.min(mobilePage, maxMobilePage)];

  const prev = () => setDesktopPage((p) => Math.max(0, p - 1));
  const next = () => setDesktopPage((p) => Math.min(maxDesktopPage, p + 1));
  const showPreviousMobileReview = () =>
    setMobilePage((p) => Math.max(0, p - 1));
  const showNextMobileReview = () =>
    setMobilePage((p) => Math.min(maxMobilePage, p + 1));

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      showNextMobileReview();
    } else {
      showPreviousMobileReview();
    }
  };

  return (
    <section
      id="reviews"
      className="mb-25 px-0 sm:px-6 md:px-8 lg:px-12 xl:px-[60px] 2xl:px-0"
    >
      <div className="mx-auto flex w-full max-w-[424px] flex-col items-center gap-5 sm:max-w-[1320px] sm:items-stretch sm:gap-10">
        <div className="flex h-6 w-full items-center justify-between px-4 sm:h-12 sm:px-0">
          <h2 className="text-[20px] font-normal leading-6 uppercase text-[#040404] sm:text-[40px] sm:leading-[48px]">
            REVIEWS FROM OUR CUSTOMERS
          </h2>
          <div className="hidden gap-2 sm:flex">
            <PrevArrow onClick={prev} disabled={desktopPage === 0} />
            <NextArrow
              onClick={next}
              disabled={desktopPage === maxDesktopPage}
            />
          </div>
        </div>

        {isLoading && <p className="px-4 text-base text-[#717171] sm:px-0">Loading reviews...</p>}

        {!isLoading && error && (
          <p className="px-4 text-base text-red-500 sm:px-0">Unable to load reviews right now.</p>
        )}

        {!isLoading && !error && data.length === 0 && (
          <p className="px-4 text-base text-[#717171] sm:px-0">No reviews yet.</p>
        )}

        <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {visibleDesktop.map(({ id, ...review }) => (
            <ReviewCard
              key={id}
              variant="figma"
              {...review}
            />
          ))}
        </div>

        <div
          className="flex w-full flex-col items-center gap-5 sm:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStartRef.current = null;
          }}
        >
          <div className="w-full px-[14px]">
            {visibleMobileReview && (
              <ReviewCard
                variant="figma"
                rating={visibleMobileReview.rating}
                date={visibleMobileReview.date}
                name={visibleMobileReview.name}
                aboutHref={visibleMobileReview.aboutHref}
                aboutText={visibleMobileReview.aboutText}
                title={visibleMobileReview.title}
                body={visibleMobileReview.body}
                footer={
                  <div className="flex h-2 items-center justify-center gap-5">
                    {data.map((review, idx) => (
                      <button
                        key={review.id}
                        type="button"
                        aria-label={`Show review ${idx + 1}`}
                        aria-current={idx === mobilePage ? "true" : undefined}
                        onClick={() => setMobilePage(idx)}
                        className={`h-2 w-2 rounded-full ${
                          idx === mobilePage
                            ? "bg-[var(--color-purple)]"
                            : "bg-[var(--color-light-purple-2)]"
                        }`}
                      />
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

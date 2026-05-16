"use client";

import { useRef, useState } from "react";
import ReviewCard from "../../components/home/ReviewCard";
import PERSON1_IMG from "../../../public/Reviews/person1.png";
import PERSON2_IMG from "../../../public/Reviews/person2.png";
import PERSON3_IMG from "../../../public/Reviews/person3.png";
import REVIEW_1_IMG1 from "../../../public/Reviews/review1_1.png";
import REVIEW_1_IMG2 from "../../../public/Reviews/review1_2.png";
import REVIEW_1_IMG3 from "../../../public/Reviews/review1_3.png";
import REVIEW_1_IMG4 from "../../../public/Reviews/review1_4.png";
import REVIEW_2_IMG1 from "../../../public/Reviews/review2_1.png";
import REVIEW_2_IMG2 from "../../../public/Reviews/review2_2.png";
import REVIEW_3_IMG1 from "../../../public/Reviews/review3_1.png";
import REVIEW_3_IMG2 from "../../../public/Reviews/review3_2.png";
import REVIEW_3_IMG3 from "../../../public/Reviews/review3_3.png";
import { StaticImageData } from "next/image";

interface Review {
  rating: number;
  date: string;
  avatarSrc: StaticImageData | string;
  name: string;
  aboutHref: string;
  aboutText: string;
  title: string;
  body: string;
  images: (StaticImageData | string)[];
}

const demo: Review[] = [
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON1_IMG,
    name: "Daniel T.",
    aboutHref: "/catalog?search=Catan",
    aboutText: "Catan",
    title: "Exquisite !",
    body: "Awesome product. Prepare yourself. This one does really big hugs to your gaming table. 36 X 60 Inch. Awesome luxurious and sober table presence and fully reversible. A nice transport bag is already included in the package.",
    images: [REVIEW_1_IMG1, REVIEW_1_IMG2, REVIEW_1_IMG3, REVIEW_1_IMG4],
  },
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON2_IMG,
    name: "Benjamin L.",
    aboutHref: "/catalog?search=7%20Wonders",
    aboutText: "7 Wonders",
    title: "Great product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: [REVIEW_2_IMG1, REVIEW_2_IMG2],
  },
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON3_IMG,
    name: "Benjamin L.",
    aboutHref: "/catalog?search=7%20Wonders",
    aboutText: "7 Wonders",
    title: "Fantastic product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: [REVIEW_3_IMG1, REVIEW_3_IMG2, REVIEW_3_IMG3],
  },
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: "/700x700.svg",
    name: "Benjamin L.",
    aboutHref: "/catalog?search=7%20Wonders",
    aboutText: "7 Wonders",
    title: "Fantastic product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: ["/700x700.svg", "/700x700.svg", "/700x700.svg", "/700x700.svg"],
  },
];

interface ArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const PrevArrow = ({ className = "", ...rest }: ArrowProps) => (
  <button
    aria-label="Previous reviews"
    className={`h-10 w-10 rounded-full transition hover:scale-105 focus:outline-none disabled:cursor-not-allowed ${className}`}
    {...rest}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#494791" />
      <path
        d="M15.8785 29.3079L14.8145 28.2439L23.0595 19.9999L14.8145 11.7559L15.8785 10.6919L25.1865 19.9999L15.8785 29.3079Z"
        fill="white"
      />
    </svg>
  </button>
);

interface ReviewSectionProps {
  reviews?: Review[];
}

const DESKTOP_PAGE_SIZE = 3;
const SWIPE_THRESHOLD_PX = 48;

export default function ReviewSection({ reviews = [] }: ReviewSectionProps) {
  const data = reviews.length ? reviews : demo;

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  const maxDesktopPage = Math.max(0, Math.ceil(data.length / DESKTOP_PAGE_SIZE) - 1);
  const maxMobilePage = Math.max(0, data.length - 1);
  const desktopSliceStart = desktopPage * DESKTOP_PAGE_SIZE;
  const visibleDesktop = data.slice(desktopSliceStart, desktopSliceStart + DESKTOP_PAGE_SIZE);
  const visibleMobile = data[Math.min(mobilePage, maxMobilePage)];

  const prev = () => setDesktopPage((p) => Math.max(0, p - 1));
  const next = () => setDesktopPage((p) => Math.min(maxDesktopPage, p + 1));
  const showPreviousMobileReview = () => setMobilePage((p) => Math.max(0, p - 1));
  const showNextMobileReview = () => setMobilePage((p) => Math.min(maxMobilePage, p + 1));

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

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      showNextMobileReview();
    } else {
      showPreviousMobileReview();
    }
  };

  return (
    <section id="reviews" className="mb-25 px-0 sm:px-6 md:px-8 lg:px-12 xl:px-[60px] 2xl:px-0">
      <div className="mx-auto flex w-full max-w-[424px] flex-col items-center gap-5 sm:max-w-[1320px] sm:items-stretch sm:gap-10">
        <div className="flex h-6 w-full items-center justify-between px-4 sm:h-12 sm:px-0">
          <h2 className="text-[20px] font-normal leading-6 uppercase text-[#040404] sm:text-[40px] sm:leading-[48px]">
            REVIEWS FROM OUR CUSTOMERS
          </h2>
          <div className="hidden gap-2 sm:flex">
            <PrevArrow onClick={prev} disabled={desktopPage === 0} />
            <NextArrow onClick={next} disabled={desktopPage === maxDesktopPage} />
          </div>
        </div>

        <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {visibleDesktop.map((review, idx) => (
            <ReviewCard key={desktopSliceStart + idx} variant="figma" {...review} />
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
            {visibleMobile && (
              <ReviewCard
                variant="figma"
                footer={
                  <div className="flex h-2 items-center justify-center gap-5">
                    {data.map((review, idx) => (
                      <button
                        key={`${review.name}-${idx}`}
                        type="button"
                        aria-label={`Show review ${idx + 1}`}
                        aria-current={idx === mobilePage ? "true" : undefined}
                        onClick={() => setMobilePage(idx)}
                        className={`h-2 w-2 rounded-full ${
                          idx === mobilePage ? "bg-[var(--color-purple)]" : "bg-[var(--color-light-purple-2)]"
                        }`}
                      />
                    ))}
                  </div>
                }
                {...visibleMobile}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

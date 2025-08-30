"use client";

import { useState } from "react";
import ReviewCard from "../../components/home/ReviewCard.jsx";
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

// ─────────────────── DEMO DATA ───────────────────
const demo = [
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON1_IMG, // Updated to use the imported image
    name: "Daniel T.",
    aboutHref: "/games/catan",
    aboutText: "Catan",
    title: "Exquisite !",
    body: "Awesome product. Prepare yourself. This one does really big hugs to your gaming table. 36×60 inches. Awesome luxurious and sober table presence and fully reversible. A nice transport bag is already included in the package.",
    images: [REVIEW_1_IMG1, REVIEW_1_IMG2, REVIEW_1_IMG3, REVIEW_1_IMG4],
  },
  {
    rating: 4,
    date: "March 28, 2025",
    avatarSrc: PERSON2_IMG,
    name: "Benjamin L.",
    aboutHref: "/games/7wonders",
    aboutText: "7 Wonders",
    title: "Great product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: [REVIEW_2_IMG1, REVIEW_2_IMG2],
  },
  {
    rating: 4,
    date: "March 28, 2025",
    avatarSrc: PERSON3_IMG,
    name: "Benjamin L.",
    aboutHref: "/games/7wonders",
    aboutText: "7 Wonders",
    title: "Fantastic product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: [REVIEW_3_IMG1, REVIEW_3_IMG2, REVIEW_3_IMG3],
  },
  {
    rating: 4,
    date: "March 28, 2025",
    avatarSrc: "/700x700.svg",
    name: "Benjamin L.",
    aboutHref: "/games/7wonders",
    aboutText: "7 Wonders",
    title: "Fantastic product",
    body: "Great product. I love the fact that it is reversible. The only thing I would change is to have a more rigid material for the bag.",
    images: ["/700x700.svg", "/700x700.svg", "/700x700.svg", "/700x700.svg"],
  },
];

// ─────────────── SVG‑кнопки лишаються без змін ───────────────
const PrevArrow = ({ className = "", ...rest }) => (
  <button
    aria-label="Previous reviews"
    className={`disabled:opacity-30 transition hover:scale-105 focus:outline-none ${className}`}
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
        fillOpacity="0.5"
      />
      <path
        d="M24.1215 10.6921L25.1855 11.7561L16.9405 20.0001L25.1855 28.2441L24.1215 29.3081L14.8135 20.0001L24.1215 10.6921Z"
        fill="white"
      />
    </svg>
  </button>
);

const NextArrow = ({ className = "", ...rest }) => (
  <button
    aria-label="Next reviews"
    className={`disabled:opacity-30 transition hover:scale-105 focus:outline-none ${className}`}
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

// ────────────────── MAIN SECTION ──────────────────
export default function ReviewSection({ reviews = [] }) {
  // якщо нічого не прийшло через пропи — падаємо на demo
  const data = reviews.length ? reviews : demo;

  const PAGE_SIZE = 3;
  const [page, setPage] = useState(0);

  const maxPage = Math.max(0, Math.ceil(data.length / PAGE_SIZE) - 1);
  const sliceStart = page * PAGE_SIZE;
  const visible = data.slice(sliceStart, sliceStart + PAGE_SIZE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(maxPage, p + 1));

  return (
    <section id="reviews" className="  mb-25 px-8 lg:px-50">
      {/* Heading + arrows */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-title font-semibold tracking-wide">REVIEWS FROM OUR CUSTOMERS</h2>
        <div className="flex gap-4">
          <PrevArrow onClick={prev} disabled={page === 0} />
          <NextArrow onClick={next} disabled={page === maxPage} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </div>
    </section>
  );
}

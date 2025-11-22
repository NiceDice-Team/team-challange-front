"use client";
import SubscribeSection from "../home/SubscribeSection";
import ReviewCard from "../home/ReviewCard";
import { Pagination } from "../ui/pagination";
import { useState } from "react";
import { CustomSelect } from "../shared/CustomSelect";
import PERSON1_IMG from "../../../public/Reviews/person1.png";
import PERSON2_IMG from "../../../public/Reviews/person2.png";
import PERSON3_IMG from "../../../public/Reviews/person3.png";
import REVIEW_1_IMG1 from "../../../public/Reviews/review1_1.png";
import REVIEW_1_IMG2 from "../../../public/Reviews/review1_2.png";
import REVIEW_2_IMG1 from "../../../public/Reviews/review2_1.png";
import REVIEW_2_IMG2 from "../../../public/Reviews/review2_2.png";

// Demo review data
const reviewComments = [
  {
    rating: 5,
    date: "March 28, 2025",
    avatarSrc: PERSON1_IMG,
    name: "Daniel T.",
    aboutHref: "/games/ticket-to-ride-europe",
    aboutText: "Ticket to Ride: Europe",
    title: "🔥 Fast, furious, and fiercely fun!",
    body: "This racing game is all about managing risk and momentum — it captures the tension of high-speed races with surprising elegance. Every decision matters, and the modular board keeps it fresh. A must-play for fans of dynamic gameplay.",
    images: [REVIEW_1_IMG1, REVIEW_1_IMG2],
  },
  {
    rating: 5,
    date: "March 18, 2025",
    avatarSrc: PERSON2_IMG,
    name: "Antony S.",
    aboutHref: "/games/catan",
    aboutText: "Catan",
    title: "Exquisite !",
    body: "Awesome product. Prepare yourself. This one does really big hugs to your gaming table. 36 X 60 Inches. Awesome luxurious and sober table presence and fully reversible. A nice transport bag is already included in the package.",
    images: [REVIEW_2_IMG1, REVIEW_2_IMG2],
  },
  {
    rating: 4,
    date: "March 15, 2025",
    avatarSrc: PERSON3_IMG,
    name: "Sarah M.",
    aboutHref: "/games/monopoly",
    aboutText: "Monopoly Classic",
    title: "Great family game night choice",
    body: "Classic gameplay that never gets old. The kids love it and it brings the whole family together. Quality pieces and board. Would definitely recommend for family game nights.",
    images: [],
  },
  {
    rating: 5,
    date: "March 12, 2025",
    avatarSrc: PERSON1_IMG,
    name: "Mike R.",
    aboutHref: "/games/chess",
    aboutText: "Chess Set Deluxe",
    title: "Perfect chess set",
    body: "Beautiful wooden chess set with excellent craftsmanship. The pieces feel substantial and the board is gorgeous. Great for both playing and display.",
    images: [],
  },
];

const REVIEWS_PER_PAGE = 2;

interface ReviewsCommentsProps {
  children?: React.ReactNode;
}

export default function ReviewsComments({ children }: ReviewsCommentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("most-recent");

  // Calculate pagination
  const totalPages = Math.ceil(reviewComments.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviewComments.slice(startIndex, endIndex);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string): void => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full max-w-[1320px] mx-auto items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Sort option and Comments section */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="uppercase text-sm sm:text-base lg:text-lg font-medium">
            sort by
          </span>
          <CustomSelect
            className="border-0 h-auto"
            placeholder="Most Recent"
            value={sortBy}
            onValueChange={handleSortChange}
            options={[
              { value: "most-recent", label: "Most Recent" },
              { value: "oldest", label: "Oldest" },
              { value: "highest-rated", label: "Highest Rated" },
              { value: "lowest-rated", label: "Lowest Rated" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          {currentReviews.map((review, idx) => (
            <ReviewCard
              className="border-t-2 border-[color:var(--color-light-purple)]"
              key={startIndex + idx}
              {...review}
              collapsible={true}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 sm:mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* Stay updated section */}
      <div className="mt-6 lg:mt-0">
        <SubscribeSection className="px-6 sm:px-10 lg:px-14 py-20 sm:py-28 lg:py-40" />
      </div>
    </section>
  );
}

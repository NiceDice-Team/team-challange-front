import StarRating from "../layout/StarsLine";

export default function ReviewsProduct({ children }) {
  return (
    <section className="flex flex-col items-center justify-center  max-w-6xl mx-auto">
      {children}

      <div className="grid grid-cols-3 gap-4 w-full h-28">
        {/* Total reviews */}
        <div className="flex flex-col justify-center items-center border-r-2 border-[var(--color-purple)]/50">
          <div className="flex flex-nowrap items-center gap-1">
            <StarRating rating={2} />
            <span className="underline underline-offset-3 underline-[var(--color-purple)] text-[var(--color-purple)]">
              4.90 out of 5
            </span>
          </div>
          <span className="text-base font-medium">Based on 8 reviews</span>
        </div>

        {/* Star list */}
        <div className="flex flex-col justify-center items-center gap-1 ">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarRating rating={5} />
          ))}
        </div>
        {/* Write a review button */}
        <div className="flex flex-col justify-center items-center border-l-2 border-[var(--color-purple)]/50">
          <button className="uppercase">Write a Review</button>
        </div>
      </div>
      {/* Vertical divider */}
    </section>
  );
}

import StarRating from "../layout/StarsLine";

interface ReviewsProductProps {
  children?: React.ReactNode;
}

export default function ReviewsProduct({ children }: ReviewsProductProps) {
  return (
    <section className="flex flex-col items-center justify-center max-w-[1320px] mx-auto mb-6 sm:mb-8 md:mb-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {children}
      <div className="mx-auto mb-6 sm:mb-8 md:mb-10">
        <h2 className="uppercase text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center">
          Reviews from our customers
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 w-full">
        {/* Total reviews */}
        <div className="flex flex-col justify-center items-center pb-6 md:pb-0 border-b-2 md:border-b-0 md:border-r-2 border-[var(--color-purple)]/50">
          <div className="flex flex-nowrap items-center gap-1">
            <StarRating rating={2} />
            <span className="underline underline-offset-3 underline-[var(--color-purple)] text-[var(--color-purple)] text-sm sm:text-base">
              4.90 out of 5
            </span>
          </div>
          <span className="text-sm sm:text-base">Based on 8 reviews</span>
        </div>

        {/* Star list */}
        <div className="flex flex-col justify-center items-center gap-1 py-4 md:py-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-nowrap justify-center items-center gap-2">
              <StarRating rating={Math.abs(-index + 5)} />
              <progress
                id="rating"
                max="100"
                value="30"
                className="w-16 sm:w-20 md:max-w-[88px] max-h-2 [&::-webkit-progress-bar]:bg-[#D9D9D9] [&::-webkit-progress-value]:bg-[#494791] [&::-moz-progress-bar]:bg-[#494791]"
                style={{
                  backgroundColor: "#D9D9D9",
                }}
              ></progress>
              <span className="text-sm sm:text-base">7</span>
            </div>
          ))}
        </div>
        {/* Write a review button */}
        <div className="flex flex-col justify-center items-center pt-6 md:pt-0 border-t-2 md:border-t-0 md:border-l-2 border-[var(--color-purple)]/50">
          <button className="uppercase bg-[var(--color-purple)] text-white py-2 px-4 text-sm sm:text-base hover:opacity-90 transition-opacity">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}

import StarRating from "../layout/StarsLine";

interface ReviewsProductProps {
  children?: React.ReactNode;
}

export default function ReviewsProduct({ children }: ReviewsProductProps) {
  return (
    <>
      <section className="sm:hidden mx-auto mt-10 w-full max-w-[428px] px-4">
        {children}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-center text-xl uppercase text-[#040404]">Reviews from our customers</h2>

          <div className="flex w-full items-center justify-between gap-4 px-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <StarRating rating={5} />
                <span className="text-base uppercase text-[var(--color-purple)] underline underline-offset-2">
                  4.90 out of 5
                </span>
              </div>
              <span className="text-base text-black">Based on 8 reviews</span>
            </div>

            <button className="flex h-12 items-center justify-center bg-[var(--color-purple)] px-8 text-base uppercase text-white">
              Write a review
            </button>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[var(--color-light-purple-2)]" />
      </section>

      <section className="hidden max-w-[1320px] mx-auto mb-6 px-4 sm:flex sm:flex-col sm:items-center sm:justify-center sm:px-6 sm:mb-8 md:mb-10 md:px-8 lg:px-12 xl:px-16">
        {children}
        <div className="mx-auto mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-center text-xl uppercase sm:text-2xl md:text-3xl lg:text-[40px]">
            Reviews from our customers
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
          <div className="flex flex-col items-center justify-center border-b-2 border-[var(--color-purple)]/50 pb-6 md:border-b-0 md:border-r-2 md:pb-0">
            <div className="flex flex-nowrap items-center gap-1">
              <StarRating rating={5} />
              <span className="text-sm text-[var(--color-purple)] underline underline-offset-3 underline-[var(--color-purple)] sm:text-base">
                4.90 out of 5
              </span>
            </div>
            <span className="text-sm sm:text-base">Based on 8 reviews</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 py-4 md:py-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-nowrap items-center justify-center gap-2">
                <StarRating rating={Math.abs(-index + 5)} />
                <progress
                  id="rating"
                  max="100"
                  value="30"
                  className="max-h-2 w-16 [&::-moz-progress-bar]:bg-[#494791] [&::-webkit-progress-bar]:bg-[#D9D9D9] [&::-webkit-progress-value]:bg-[#494791] sm:w-20 md:max-w-[88px]"
                  style={{
                    backgroundColor: "#D9D9D9",
                  }}
                ></progress>
                <span className="text-sm sm:text-base">7</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center border-t-2 border-[var(--color-purple)]/50 pt-6 md:border-t-0 md:border-l-2 md:pt-0">
            <button className="bg-[var(--color-purple)] px-4 py-2 text-sm uppercase text-white transition-opacity hover:opacity-90 sm:text-base">
              Write a Review
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

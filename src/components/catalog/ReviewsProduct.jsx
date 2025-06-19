import StarRating from "../layout/StarsLine";

export default function ReviewsProduct({ children }) {
  return (
    <section className="flex flex-col items-center justify-center  max-w-6xl mx-auto">
      {children}
      <div className="mx-auto mb-10">
        <h2 className="uppercase text-[40px]">Reviews from our customers</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full h-28">
        {/* Total reviews */}
        <div className="flex flex-col justify-center items-center border-r-2 border-[var(--color-purple)]/50">
          <div className="flex flex-nowrap items-center gap-1">
            <StarRating rating={2} />
            <span className="underline underline-offset-3 underline-[var(--color-purple)] text-[var(--color-purple)]">
              4.90 out of 5
            </span>
          </div>
          <span className="text-base ">Based on 8 reviews</span>
        </div>

        {/* Star list */}
        <div className="flex flex-col justify-center items-center gap-1 ">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-nowrap justify-center items-center gap-2">
              <StarRating rating={5} />
              <progress
                id="rating"
                max="100"
                value="30"
                className="max-w-[88px] max-h-2 [&::-webkit-progress-bar]:bg-[#D9D9D9] [&::-webkit-progress-value]:bg-[#494791] [&::-moz-progress-bar]:bg-[#494791]"
                style={{
                  backgroundColor: "#D9D9D9",
                }}
              ></progress>
              <span>7</span>
            </div>
          ))}
        </div>
        {/* Write a review button */}
        <div className="flex flex-col justify-center items-center border-l-2 border-[var(--color-purple)]/50">
          <button className="uppercase bg-[var(--color-purple)] text-white py-2 px-4 ">Write a Review</button>
        </div>
      </div>
      {/* Vertical divider */}
    </section>
  );
}

export default function ProductCardSkeleton() {
  return (
    <article className="mx-auto flex w-full max-w-[380px] min-w-0 flex-col bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.1)] sm:h-[427px] sm:max-w-[240px]">
      {/* Image skeleton */}
      <div className="relative isolate flex h-[307px] w-full flex-col items-center pt-4 pb-4 sm:h-[190px]">
        <div className="z-0 h-[275px] w-full flex-grow bg-gray-200 animate-pulse sm:h-[158px]"></div>
        {/* Navigation lines skeleton sits in the bottom 16px image-frame padding. */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[3px] w-full items-start justify-center">
          <div className="flex justify-center items-start gap-0">
            <div className="w-[78px] h-[3px] bg-gray-300" />
            <div className="w-[78px] h-[3px] bg-gray-300" />
            <div className="w-[84px] h-[3px] bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Product details skeleton */}
      <div className="flex flex-col items-start gap-4 px-4 pt-4 pb-4 sm:h-[237px] sm:gap-0">
        <div className="h-[19px] w-[72px] overflow-hidden rounded bg-gray-200 animate-pulse sm:h-[44px] sm:w-[145px]"></div>

        <div className="flex h-[19px] w-[104px] items-center gap-1 sm:mt-2">
          <div className="flex h-4 w-[80px] gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="w-5 h-[19px] bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:mt-4">
          <div className="h-6 w-[79px] rounded bg-gray-200 animate-pulse sm:h-[29px]"></div>

          <div className="flex h-[17px] items-center justify-start gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-[17px] w-[150px] rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        {/* Add to cart button skeleton */}
        <div className="h-12 w-full shrink-0 bg-gray-200 animate-pulse sm:mt-4"></div>
      </div>
    </article>
  );
}

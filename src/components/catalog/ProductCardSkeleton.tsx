export default function ProductCardSkeleton() {
  return (
    <article className="mx-auto flex min-h-[539px] w-full max-w-[396px] min-w-0 flex-col bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.1)] sm:h-[427px] sm:max-w-[240px] sm:min-h-0 sm:min-w-[200px]">
      {/* Image skeleton */}
      <div className="relative isolate flex h-[307px] w-full flex-col items-center gap-4 pt-4 sm:h-[190px]">
        <div className="z-0 h-[275px] w-full flex-grow bg-gray-200 animate-pulse sm:h-[158px]"></div>
        {/* Navigation lines skeleton */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-0 flex justify-center items-start z-10">
          <div className="flex justify-center items-start gap-0">
            <div className="w-[78px] h-[3px] bg-gray-300" />
            <div className="w-[78px] h-[3px] bg-gray-300" />
            <div className="w-[84px] h-[3px] bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Product details skeleton */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-start">
          <div className="flex min-w-0 flex-col gap-2 sm:w-[145px]">
            <div className="h-[44px] w-[145px] overflow-hidden rounded bg-gray-200 animate-pulse"></div>
            <div className="flex h-[19px] w-[104px] items-center gap-1">
              <div className="flex h-4 w-[80px] gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="w-5 h-[19px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex min-w-[150px] flex-col items-end gap-2 sm:min-w-0 sm:w-full sm:items-start">
            <div className="h-6 w-[79px] rounded bg-gray-200 animate-pulse"></div>
            <div className="flex h-[17px] w-full items-center justify-end gap-2 sm:justify-start">
              <div className="h-2 w-2 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-[17px] w-24 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Add to cart button skeleton */}
        <div className="mt-auto h-12 w-full bg-gray-200 animate-pulse"></div>
      </div>
    </article>
  );
}

export default function ProductCardSkeleton() {
  return (
    <article className="flex flex-col w-full max-w-[240px] min-w-[200px] h-[427px] mx-auto bg-white shadow-md">
      {/* Image skeleton */}
      <div className="relative h-[190px] w-full pt-4 flex flex-col items-center gap-4 isolate">
        <div className="w-full h-[158px] bg-gray-200 animate-pulse flex-grow z-0"></div>
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
      <div className="flex flex-col p-4 gap-4 w-full h-[237px]">
        {/* Product name and rating section */}
        <div className="flex items-start gap-2 w-full h-[71px]">
          <div className="flex flex-col gap-2 w-[145px] h-[71px]">
            <div className="w-[145px] h-[44px] bg-gray-200 rounded animate-pulse overflow-hidden"></div>
            <div className="flex items-center gap-1 w-[104px] h-[19px]">
              <div className="flex gap-1 w-[80px] h-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="w-5 h-[19px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Price and stock section */}
        <div className="flex flex-col gap-2 w-full h-[54px]">
          <div className="w-[79px] h-[29px] bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2 w-full h-[17px]">
            <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-[17px] w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Add to cart button skeleton */}
        <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </article>
  );
}

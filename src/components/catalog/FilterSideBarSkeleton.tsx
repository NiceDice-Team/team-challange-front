export default function FilterSideBarSkeleton() {
  return (
    <section className="w-full max-w-[396px] mx-auto flex-shrink-0 lg:mx-0 lg:w-[247px] lg:max-w-none">
      {/* Mobile Filter Toggle Skeleton */}
      <div className="mb-6 flex h-12 w-full items-center justify-between  border border-[#494791] bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-200 animate-pulse"></div>
          <div className="h-5 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Filter sections */}
      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4].map((section) => (
          <div
            key={section}
            className="flex w-full flex-col items-start gap-6 bg-white p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] lg:w-[247px]"
          >
            <div className="flex flex-row justify-between items-center w-full">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex flex-row justify-between items-center gap-2 w-full">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Price section */}
        <div className="flex w-full flex-col items-start gap-4 bg-white p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] lg:w-[247px] lg:gap-6">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="h-8 w-[88px] bg-gray-200 rounded animate-pulse lg:h-10 lg:flex-1"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-[88px] bg-gray-200 rounded animate-pulse lg:h-10 lg:flex-1"></div>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse lg:hidden"></div>
        </div>
      </div>
    </section>
  );
}

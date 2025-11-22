export default function FilterSideBarSkeleton() {
  return (
    <section className="w-full lg:w-[247px] flex-shrink-0">
      {/* Mobile Filter Toggle Skeleton */}
      <div className="lg:hidden w-full flex items-center justify-between p-4 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)] mb-4">
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Filter sections */}
      <div className="hidden lg:flex flex-col gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((section) => (
          <div
            key={section}
            className="flex flex-col items-start p-4 gap-4 sm:gap-6 w-full lg:w-[247px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
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
        <div className="flex flex-col items-start p-4 gap-4 sm:gap-6 w-full lg:w-[247px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="w-20 sm:w-24 lg:flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 sm:w-24 lg:flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

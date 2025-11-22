export default function FilterSideBarSkeleton() {
  return (
    <section className="min-w-40 max-w-2xs mt-5">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="border-t border-[#494791] my-5"></div>

      {/* Filter sections */}
      {[1, 2, 3, 4].map((section) => (
        <div key={section}>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="mt-2 space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="ms-2 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#494791] my-5"></div>
        </div>
      ))}

      {/* Price section */}
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </section>
  );
}

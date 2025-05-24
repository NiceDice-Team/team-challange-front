import React from "react";

export default function ProductCardSkeleton() {
  return (
    <article className="flex flex-col w-60">
      {/* Image skeleton */}
      <div className="relative h-48 w-full  bg-gray-200 animate-pulse "></div>
      {/* Navigation lines skeleton */}
      <div className="mt-1  flex justify-center space-x-0.5">
        {[0, 1, 2].map((index) => (
          <div key={index} className="w-20 h-1 bg-gray-300" />
        ))}
      </div>

      {/* Product details skeleton */}
      <div className="flex flex-col mt-3">
        {/* Product name skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>

        {/* Stars and reviews skeleton */}
        <div className="flex items-center mt-1 space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse ml-1"></div>
        </div>

        {/* Price skeleton */}
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>

        {/* Stock status skeleton */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Add to cart button skeleton */}
        <div className="mt-4 w-full h-10 bg-gray-200  animate-pulse"></div>
      </div>
    </article>
  );
}

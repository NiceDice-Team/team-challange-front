"use client";
import ProductsGrid from "../../../components/catalog/ProductsGrid";
import FilterSideBar from "../../../components/catalog/FilterSideBar";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { Suspense } from "react";

function CatalogContent() {
  const { selectedFilters, setSelectedFilters } = useUrlFilters();

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] w-full flex justify-center items-center mb-4 sm:mb-6 uppercase">Board games</h2>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <FilterSideBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

          <div className="flex-1 min-w-0">
            <ProductsGrid selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

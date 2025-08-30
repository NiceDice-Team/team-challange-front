"use client";
import ProductsGrid from "../../../components/catalog/ProductsGrid.jsx";
import FilterSideBar from "../../../components/catalog/FilterSideBar.jsx";
import { useUrlFilters } from "../../../hooks/useUrlFilters.js";
import { Suspense } from "react";

function CatalogContent() {
  const { selectedFilters, setSelectedFilters } = useUrlFilters();

  return (
    <div className="px-8 lg:px-16">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="text-[40px] w-full flex justify-center items-center mb-4 uppercase">Board games</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSideBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </div>

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

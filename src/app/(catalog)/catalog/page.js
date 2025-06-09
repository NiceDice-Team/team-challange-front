"use client";
import ProductsGrid from "../../../components/catalog/ProductsGrid.jsx";
import FilterSideBar from "../../../components/catalog/FilterSideBar.jsx";
import { useState } from "react";

export default function Catalog() {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    gameTypes: [],
    audiences: [],
    brands: [],
    priceRange: { min: 0, max: 200 },
  });

  return (
    <div className="px-8 lg:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSideBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </aside>

          <div className="flex-1">
            <ProductsGrid selectedFilters={selectedFilters} />
          </div>
        </div>
      </div>
    </div>
  );
}

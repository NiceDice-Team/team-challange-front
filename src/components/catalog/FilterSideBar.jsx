"use client";
import { useState } from "react";

export default function FilterSideBar() {
  const [selectedFilters, setSelectedFilters] = useState({
    featured: ["Featured"],
    category: [],
    audience: ["Audience"],
    brands: ["Brands"],
  });

  const filterButton = (name, filter_type) => {
    return (
      <div className="bg-[#C6C6E2] p-1.5 text-black text-sm flex justify-center items-center">
        {name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 inline-block ml-1 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => {
            setSelectedFilters((prevFilters) => ({
              ...prevFilters,
              [filter_type]: prevFilters[filter_type].filter((filter) => filter !== name),
            }));
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };

  return (
    <section className="min-w-40 max-w-2xs mt-5">
      <di className="flex flex-row justify-between items-center mb-4">
        <h3 className="uppercase text-lg font-bold">Filters</h3>
        <button
          onClick={() => {
            setSelectedFilters({
              featured: [],
              category: [],
              audience: [],
              brands: [],
            });
          }}
          className="underline text-[#717171] text-base"
        >
          Clear all
        </button>
      </di>

      <div className="flex flex-wrap gap-4">
        {selectedFilters.featured.map((name) => filterButton(name, "featured"))}
        {selectedFilters.category.map((name) => filterButton(name, "category"))}
        {selectedFilters.audience.map((name) => filterButton(name, "audience"))}
        {selectedFilters.brands.map((name) => filterButton(name, "brands"))}
      </div>
      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Featured</h4>

      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Game Type</h4>
      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Audience</h4>
      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Brands</h4>
      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Price</h4>
    </section>
  );
}

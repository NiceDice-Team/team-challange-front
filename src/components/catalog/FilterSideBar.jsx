"use client";
import { useState } from "react";
import { catalogServices } from "@/services/catalogServices";
import { useQuery } from "@tanstack/react-query";

export default function FilterSideBar() {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogServices.getCategories,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    featured: ["Featured"],
    game_type: [],
    audience: ["Audience"],
    brands: ["Brands"],
  });

  const filterShowButton = (filterShowButton_name, filter_type, index) => {
    return (
      <div key={index} className="bg-[#C6C6E2] p-1.5 text-black text-sm flex justify-center items-center">
        {filterShowButton_name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 inline-block ml-1 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => {
            setSelectedFilters((prevFilters) => ({
              ...prevFilters,
              [filter_type]: prevFilters[filter_type].filter((filter) => filter !== filterShowButton_name),
            }));
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };
  const filterButton = (category) => {
    return (
      <div key={category.id} className="flex items-center">
        <input
          checked={selectedFilters.game_type.includes(category.id)}
          id={`checkbox-${category}`}
          type="checkbox"
          onChange={() => {
            // Змінено з (prev) => на просто ()
            setSelectedFilters((prev) => {
              // Додано правильний доступ до попереднього стану
              if (prev.game_type.includes(category.id)) {
                return {
                  ...prev,
                  game_type: prev.game_type.filter((id) => id !== category.id),
                };
              } else {
                return {
                  ...prev,
                  game_type: [...prev.game_type, category.id],
                };
              }
            });
          }}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor={`checkbox-${category.id}`}
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {category.name}
        </label>
      </div>
    );
  };

  return (
    <section className="min-w-40 max-w-2xs mt-5">
      <div className="flex flex-row justify-between items-center mb-4">
        <h3 className="uppercase text-lg font-bold">Filters</h3>
        <button
          onClick={() => {
            setSelectedFilters({
              featured: [],
              game_type: [],
              audience: [],
              brands: [],
            });
          }}
          className="underline text-[#717171] text-base"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {selectedFilters.game_type.map((id) => {
          const category = categories?.find((cat) => cat.id === id);
          return filterShowButton(category ? category.name : id, "game_type", id);
        })}
      </div>
      <div className="border-t border-[#494791] my-5"></div>
      <h4 className="text-base font-semibold uppercase"> Featured</h4>

      <div className="border-t border-[#494791] my-5"></div>

      {/*1. GAME TYPE CATEGORIES */}
      <h4 className="text-base font-semibold uppercase"> Game Type</h4>
      <div className="mt-2">
        {categoriesLoading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : categoriesError ? (
          <div className="text-sm text-red-500">Error loading categories: {categoriesError.message}</div>
        ) : categories && categories.length ? (
          // Fix: return the result of mapping
          categories.map((category) => filterButton(category))
        ) : (
          <div>No categories found</div>
        )}
      </div>
      <div className="border-t border-[#494791] my-5"></div>
      {/*2. AUDIENCE CATEGORIES */}
      <h4 className="text-base font-semibold uppercase"> Audience</h4>
      <div className="border-t border-[#494791] my-5"></div>
      {/*3. BRANDS CATEGORIES */}
      <h4 className="text-base font-semibold uppercase"> Brands</h4>
      <div className="border-t border-[#494791] my-5"></div>
      {/*4. PRICE CATEGORIES */}
      <h4 className="text-base font-semibold uppercase"> Price</h4>
    </section>
  );
}

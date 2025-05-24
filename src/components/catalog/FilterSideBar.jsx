"use client";
import { catalogServices } from "../../services/catalogServices";
import { useQuery } from "@tanstack/react-query";
import FilterSideBarSkeleton from "./FilterSideBarSkeleton";

export default function FilterSideBar({ selectedFilters, setSelectedFilters }) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogServices.getCategories,
  });

  const {
    data: audiences,
    isLoading: audiencesLoading,
    error: audiencesError,
  } = useQuery({
    queryKey: ["audiences"],
    queryFn: catalogServices.getAudiences,
  });

  const {
    data: gameTypes,
    isLoading: gameTypesLoading,
    error: gameTypesError,
  } = useQuery({
    queryKey: ["game-types"],
    queryFn: catalogServices.getGameTypes,
  });

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: catalogServices.getBrands,
  });

  // Helper function to handle checkbox changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value],
        };
      }
    });
  };

  // Function to render filter tags
  const renderFilterTag = (filterName, filterType, value) => {
    return (
      <div
        key={`${filterType}-${value}`}
        className="bg-[#C6C6E2] p-1.5 text-black text-sm flex justify-center items-center "
      >
        {filterName}
        <svg
          className="h-3 w-3 inline-block ml-1 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => handleFilterChange(filterType, value)}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };

  // Function to render checkbox filters
  const renderCheckbox = (item, filterType, displayName) => {
    const value = item.id || item.name; // Use id for categories, name for others
    const isChecked = selectedFilters[filterType]?.includes(value) || false;

    return (
      <div key={`${filterType}-${value}`} className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          id={`checkbox-${filterType}-${value}`}
          onChange={() => handleFilterChange(filterType, value)}
          className="w-4 h-4 border border-[#494791] accent-[#494791] rounded-none"
        />

        <label htmlFor={`checkbox-${filterType}-${value}`} className="ms-2 text-base font-medium text-gray-900">
          {displayName || item.name}
        </label>
      </div>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      gameTypes: [],
      audiences: [],
      brands: [],
      priceRange: { min: 0, max: 200 },
    });
  };

  // Check if any filters are selected
  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.gameTypes.length > 0 ||
    selectedFilters.audiences.length > 0 ||
    selectedFilters.brands.length > 0;

  // Show skeleton while loading
  const isLoading = categoriesLoading || audiencesLoading || gameTypesLoading || brandsLoading;

  if (isLoading) {
    return <FilterSideBarSkeleton />;
  }

  return (
    <section className="min-w-40 max-w-2xs mt-5">
      <div className="flex flex-row justify-between items-center mb-4">
        <h3 className="uppercase text-lg font-bold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="underline text-[#717171] text-base hover:text-gray-900 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Categories */}
          {selectedFilters.categories.map((id) => {
            const category = categories?.find((cat) => cat.id === id);
            return category && renderFilterTag(category.name, "categories", id);
          })}

          {/* Game Types */}
          {selectedFilters.gameTypes.map((name) => renderFilterTag(name, "gameTypes", name))}

          {/* Audiences */}
          {selectedFilters.audiences.map((name) => renderFilterTag(name, "audiences", name))}

          {/* Brands */}
          {selectedFilters.brands.map((name) => renderFilterTag(name, "brands", name))}
        </div>
      )}

      <div className="border-t border-[#494791] my-5"></div>

      {/* CATEGORIES FILTER */}
      <h4 className="text-base font-semibold uppercase">Categories</h4>
      <div className="mt-2 space-y-2">
        {categoriesLoading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : categoriesError ? (
          <div className="text-sm text-red-500">Error loading categories</div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => renderCheckbox(category, "categories", category.name))
        ) : (
          <div className="text-sm text-gray-500">No categories available</div>
        )}
      </div>

      <div className="border-t border-[#494791] my-5"></div>

      {/* GAME TYPES FILTER */}
      <h4 className="text-base font-semibold uppercase">Game Types</h4>
      <div className="mt-2 space-y-2">
        {gameTypesLoading ? (
          <div className="text-sm text-gray-500">Loading game types...</div>
        ) : gameTypesError ? (
          <div className="text-sm text-red-500">Error loading game types</div>
        ) : gameTypes && gameTypes.length > 0 ? (
          gameTypes.map((type) => renderCheckbox(type, "gameTypes", type.name))
        ) : (
          <div className="text-sm text-gray-500">No game types available</div>
        )}
      </div>

      <div className="border-t border-[#494791] my-5"></div>

      {/* AUDIENCE FILTER */}
      <h4 className="text-base font-semibold uppercase">Audience</h4>
      <div className="mt-2 space-y-2">
        {audiencesLoading ? (
          <div className="text-sm text-gray-500">Loading audiences...</div>
        ) : audiencesError ? (
          <div className="text-sm text-red-500">Error loading audiences</div>
        ) : audiences && audiences.length > 0 ? (
          audiences.map((audience) => renderCheckbox(audience, "audiences", audience.name))
        ) : (
          <div className="text-sm text-gray-500">No audiences available</div>
        )}
      </div>

      <div className="border-t border-[#494791] my-5"></div>

      {/* BRANDS FILTER */}
      <h4 className="text-base font-semibold uppercase">Brands</h4>
      <div className="mt-2 space-y-2">
        {brandsLoading ? (
          <div className="text-sm text-gray-500">Loading brands...</div>
        ) : brandsError ? (
          <div className="text-sm text-red-500">Error loading brands</div>
        ) : brands && brands.length > 0 ? (
          brands.map((brand) => renderCheckbox(brand, "brands", brand.name))
        ) : (
          <div className="text-sm text-gray-500">No brands available</div>
        )}
      </div>

      <div className="border-t border-[#494791] my-5"></div>

      {/* PRICE FILTER */}
      <h4 className="text-base font-semibold uppercase">Price</h4>
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={selectedFilters.priceRange.min}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: parseFloat(e.target.value) || 0 },
              }))
            }
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={selectedFilters.priceRange.max}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: parseFloat(e.target.value) || 200 },
              }))
            }
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </section>
  );
}

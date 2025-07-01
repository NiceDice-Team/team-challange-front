"use client";
import { catalogServices } from "../../services/catalogServices";
import { useQuery } from "@tanstack/react-query";
import FilterSideBarSkeleton from "./FilterSideBarSkeleton";

export default function FilterSideBar({ selectedFilters, setSelectedFilters }) {
  // Fetch all filter data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogServices.getCategories,
  });

  const { data: audiences = [], isLoading: audiencesLoading } = useQuery({
    queryKey: ["audiences"],
    queryFn: catalogServices.getAudiences,
  });

  const { data: gameTypes = [], isLoading: gameTypesLoading } = useQuery({
    queryKey: ["game-types"],
    queryFn: catalogServices.getGameTypes,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: catalogServices.getBrands,
  });

  const isLoading = categoriesLoading || audiencesLoading || gameTypesLoading || brandsLoading;

  // Toggle filter value
  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType]?.includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...(prev[filterType] || []), value],
    }));
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

  // Check if any filters are active
  const hasActiveFilters = Object.entries(selectedFilters)
    .filter(([key]) => key !== "priceRange")
    .some(([, values]) => values.length > 0);

  // Render filter tag with remove button
  const FilterTag = ({ name, filterType, value }) => (
    <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
      {name}
      <svg
        className="h-3 w-3 inline-block ml-1 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => toggleFilter(filterType, value)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );

  // Render checkbox for filter option
  const FilterCheckbox = ({ item, filterType }) => {
    const value = item.id || item.name;
    const isChecked = selectedFilters[filterType]?.includes(value);

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => toggleFilter(filterType, value)}
          className="w-4 h-4 border border-[#494791] accent-[#494791] rounded-none"
        />
        <label className="ms-2 text-base font-medium text-gray-900">{item.name}</label>
      </div>
    );
  };

  // Render filter section
  const FilterSection = ({ title, items, filterType }) => (
    <div className="flex flex-col gap-6">
      <h4 className="text-base font-medium uppercase">{title}</h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <FilterCheckbox key={item.id || item.name} item={item} filterType={filterType} />
        ))}
      </div>
    </div>
  );

  if (isLoading) return <FilterSideBarSkeleton />;

  return (
    <section className="w-[247px] flex flex-col gap-6">
      {/* Active Filters Display Card */}
      {hasActiveFilters && (
        <div className="bg-white shadow-md p-4 flex flex-col gap-6">
          {/* Header with clear all button */}
          <div className="flex flex-row justify-between items-center">
            <h3 className="uppercase text-base font-medium">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="underline text-[var(--color-gray-2)] text-base hover:text-gray-900 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {selectedFilters.categories.map((id) => {
              const category = categories.find((cat) => cat.id === id);
              return category && <FilterTag key={id} name={category.name} filterType="categories" value={id} />;
            })}
            {selectedFilters.gameTypes.map((name) => (
              <FilterTag key={name} name={name} filterType="gameTypes" value={name} />
            ))}
            {selectedFilters.audiences.map((name) => (
              <FilterTag key={name} name={name} filterType="audiences" value={name} />
            ))}
            {selectedFilters.brands.map((name) => (
              <FilterTag key={name} name={name} filterType="brands" value={name} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections as Cards */}
      <div className="bg-white shadow-lg p-4">
        <FilterSection title="Categories" items={categories} filterType="categories" />
      </div>

      <div className="bg-white shadow-md p-4">
        <FilterSection title="Game Types" items={gameTypes} filterType="gameTypes" />
      </div>

      <div className="bg-white shadow-md p-4">
        <FilterSection title="Audience" items={audiences} filterType="audiences" />
      </div>

      <div className="bg-white shadow-md p-4">
        <FilterSection title="Brands" items={brands} filterType="brands" />
      </div>

      {/* Price Filter Card */}
      <div className="bg-white shadow-md p-4 flex flex-col gap-4">
        <h4 className="text-base font-medium uppercase">Price</h4>
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

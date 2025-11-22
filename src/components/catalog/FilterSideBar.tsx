"use client";
import { useState } from "react";
import { catalogServices } from "../../services/catalogServices";
import { useQuery } from "@tanstack/react-query";
import { FilterCheckmarkIcon, ChevronDownIcon, CloseIcon } from "../../svgs/icons";
import FilterSideBarSkeleton from "./FilterSideBarSkeleton";
import type { SelectedFilters, FilterItem, FilterSideBarProps } from "@/types/catalog";

export default function FilterSideBar({ selectedFilters, setSelectedFilters }: FilterSideBarProps) {
  // Fetch all filter data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => catalogServices.getCategories({}, { signal }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Fetch product counts for all categories
  const { data: categoryCounts = {} as Record<number, number>, isLoading: countsLoading } = useQuery({
    queryKey: ["category-counts", categories.map((cat: any) => cat.id)],
    queryFn: async ({ signal }) => {
      if (categories.length === 0) return {};

      const countPromises = categories.map((category: any) =>
        catalogServices.getProductCount({ category_id: category.id }, { signal })
          .then((response: any) => ({ id: category.id, count: response.count }))
          .catch(() => ({ id: category.id, count: 0 }))
      );

      const counts = await Promise.all(countPromises);
      return counts.reduce((acc: Record<number, number>, { id, count }) => {
        acc[id] = count;
        return acc;
      }, {} as Record<number, number>);
    },
    enabled: categories.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const { data: audiences = [], isLoading: audiencesLoading } = useQuery({
    queryKey: ["audiences"],
    queryFn: ({ signal }) => catalogServices.getAudiences({}, { signal }),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const { data: gameTypes = [], isLoading: gameTypesLoading } = useQuery({
    queryKey: ["game-types"],
    queryFn: ({ signal }) => catalogServices.getGameTypes({}, { signal }),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: ({ signal }) => catalogServices.getBrands({}, { signal }),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const isLoading = categoriesLoading || audiencesLoading || gameTypesLoading || brandsLoading || countsLoading;

  // Toggle filter value with scroll position preservation
  const toggleFilter = (filterType: string, value: number | string, event?: React.MouseEvent): void => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const newFilters = {
      ...selectedFilters,
      [filterType]: (selectedFilters[filterType as keyof SelectedFilters] as any)?.includes(value)
        ? (selectedFilters[filterType as keyof SelectedFilters] as any).filter((item: any) => item !== value)
        : [...((selectedFilters[filterType as keyof SelectedFilters] as any) || []), value],
    };
    setSelectedFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      gameTypes: [],
      audiences: [],
      brands: [],
      priceRange: { min: 0, max: 200 },
      sortBy: 'relevance',
      search: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.entries(selectedFilters)
    .filter(([key]) => !["priceRange", "sortBy", "search"].includes(key))
    .some(([, values]) => values.length > 0) ||
    selectedFilters.priceRange?.min > 0 ||
    selectedFilters.priceRange?.max < 200 ||
    selectedFilters.search ||
    (selectedFilters.sortBy && selectedFilters.sortBy !== 'relevance');

  // Render filter tag with remove button
  const FilterTag = ({ name, filterType, value }: { name: string; filterType: string; value: number | string }) => (
    <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
      {name}
      <button
        type="button"
        tabIndex={-1}
        className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
        onClick={(e) => toggleFilter(filterType, value, e)}
      >
        <CloseIcon className="h-3 w-3" />
      </button>
    </div>
  );

  // Render checkbox for filter option
  const FilterCheckbox = ({ item, filterType }: { item: FilterItem; filterType: string }) => {
    const value = item.id || item.name;
    const isChecked = selectedFilters[filterType]?.includes(value);

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFilter(filterType, value, e);
    };

    const handleLabelClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFilter(filterType, value, e);
    };

    // Get count based on filter type
    const getCount = () => {
      if (filterType === 'categories' && item.id) {
        // Only return count if it exists in categoryCounts
        return item.id in categoryCounts ? categoryCounts[item.id] : null;
      }
      // For other filter types, return count if it exists
      return item.count !== undefined ? item.count : null;
    };

    const count = getCount();

    return (
      <div className="flex flex-row justify-between items-center gap-2 h-5">
        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <input
              type="checkbox"
              checked={isChecked}
              onClick={handleCheckboxClick}
              className="w-5 h-5 border border-[#494791] bg-white checked:bg-[#494791] checked:border-[#494791] appearance-none cursor-pointer"
            />
            {isChecked && (
              <FilterCheckmarkIcon className="absolute top-[2px] left-[2px] w-4 h-4 text-white pointer-events-none" />
            )}
          </div>
          <button
            type="button"
            className="text-base font-normal text-black cursor-pointer hover:opacity-70"
            onClick={handleLabelClick}
          >
            {item.name}
          </button>
        </div>
        {count !== null && (
          <span className="text-base font-normal text-[#717171]">
            {count}
          </span>
        )}
      </div>
    );
  };

  // Render filter section with collapsible functionality
  const FilterSection = ({ title, items, filterType }: { title: string; items: FilterItem[]; filterType: string }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggleExpanded = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };
    
    return (
      <div className="flex flex-col items-start p-4 gap-6 w-[247px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
        {/* Header with toggle arrow */}
        <div className="flex flex-row justify-between items-center w-full">
          <h4 className="text-base font-medium uppercase text-black font-['Noto_Sans_JP']">{title}</h4>
          <button 
            type="button"
            onClick={handleToggleExpanded}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70"
          >
            <ChevronDownIcon className="w-6 h-6" isExpanded={isExpanded} />
          </button>
        </div>
        
        {/* Filter items */}
        {isExpanded && (
          <div className="flex flex-col items-start gap-2 w-full">
            {items.map((item) => (
              <FilterCheckbox key={item.id || item.name} item={item} filterType={filterType} />
            ))}
          </div>
        )}
      </div>
    );
  };

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
              type="button"
              onClick={clearAllFilters}
              className="underline text-[var(--color-gray-2)] text-base hover:text-gray-900 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2" style={{ overflowAnchor: 'none' }}>
            {selectedFilters.categories.map((id: number) => {
              const category = categories.find((cat: any) => cat.id === id);
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
            {selectedFilters.search && (
              <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
                Search: &quot;{selectedFilters.search}&quot;
                <button
                  type="button"
                  tabIndex={-1}
                  className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFilters((prev: SelectedFilters) => ({ ...prev, search: '' }));
                  }}
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedFilters.sortBy && selectedFilters.sortBy !== 'relevance' && (
              <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
                Sort: {selectedFilters.sortBy.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                <button
                  type="button"
                  tabIndex={-1}
                  className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFilters((prev: SelectedFilters) => ({ ...prev, sortBy: 'relevance' }));
                  }}
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            )}
            {(selectedFilters.priceRange?.min > 0 || selectedFilters.priceRange?.max < 200) && (
              <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
                Price: ${selectedFilters.priceRange.min} - ${selectedFilters.priceRange.max}
                <button
                  type="button"
                  tabIndex={-1}
                  className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFilters((prev: SelectedFilters) => ({ ...prev, priceRange: { min: 0, max: 200 } }));
                  }}
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Sections as Cards */}
      <FilterSection title="Categories" items={categories} filterType="categories" />
      
      <FilterSection title="Game Types" items={gameTypes} filterType="gameTypes" />
      
      <FilterSection title="Audience" items={audiences} filterType="audiences" />
      
      <FilterSection title="Brands" items={brands} filterType="brands" />

      {/* Price Filter Card */}
      <div className="flex flex-col items-start p-4 gap-6 w-[247px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
        <div className="flex flex-row justify-between items-center w-full">
          <h4 className="text-base font-medium uppercase text-black font-['Noto_Sans_JP']">Price</h4>
        </div>
        <div className="flex items-center gap-2 w-full">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={selectedFilters.priceRange.min}
            onChange={(e) => {
              const newFilters = {
                ...selectedFilters,
                priceRange: { ...selectedFilters.priceRange, min: parseFloat(e.target.value) || 0 },
              };
              setSelectedFilters(newFilters);
            }}
            className="flex-1 px-3 py-2 border border-[#494791] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#494791]"
          />
          <span className="text-[#717171] text-base">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={selectedFilters.priceRange.max}
            onChange={(e) => {
              const newFilters = {
                ...selectedFilters,
                priceRange: { ...selectedFilters.priceRange, max: parseFloat(e.target.value) || 200 },
              };
              setSelectedFilters(newFilters);
            }}
            className="flex-1 px-3 py-2 border border-[#494791] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#494791]"
          />
        </div>
      </div>
    </section>
  );
}

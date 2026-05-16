"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { catalogServices } from "../../services/catalogServices";
import { productServices } from "../../services/productServices";
import { useQuery } from "@tanstack/react-query";
import { FilterCheckmarkIcon, ChevronDownIcon, CloseIcon } from "../../svgs/icons";
import FilterSideBarSkeleton from "./FilterSideBarSkeleton";
import type { SelectedFilters, FilterItem, Category } from "@/types/catalog";

const FEATURED_CATEGORY_CONFIG = [
  { label: "New arrivals", names: ["new arrivals", "new arrival"] },
  { label: "Sale", names: ["sale"] },
  { label: "Coming soon", names: ["coming soon"] },
];

const normalizeCategoryName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

// Component props
interface FilterSideBarProps {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}

export default function FilterSideBar({ selectedFilters, setSelectedFilters }: FilterSideBarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(true);
  const normalizedCategories = useMemo(
    () => [...selectedFilters.categories].sort((a, b) => a - b),
    [selectedFilters.categories],
  );
  const normalizedGameTypes = useMemo(
    () => [...selectedFilters.gameTypes].sort(),
    [selectedFilters.gameTypes],
  );
  const normalizedAudiences = useMemo(
    () => [...selectedFilters.audiences].sort(),
    [selectedFilters.audiences],
  );
  const normalizedBrands = useMemo(
    () => [...selectedFilters.brands].sort(),
    [selectedFilters.brands],
  );
  const priceBoundsFilters = useMemo(
    () => ({
      categories: normalizedCategories,
      gameTypes: normalizedGameTypes,
      audiences: normalizedAudiences,
      brands: normalizedBrands,
      search: selectedFilters.search,
    }),
    [
      normalizedAudiences,
      normalizedBrands,
      normalizedCategories,
      normalizedGameTypes,
      selectedFilters.search,
    ],
  );

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

  const featuredCategories = useMemo(
    () =>
      FEATURED_CATEGORY_CONFIG.flatMap(({ label, names }) => {
        const category = categories.find((item: Category) => names.includes(normalizeCategoryName(item.name)));
        return category ? [{ ...category, name: label }] : [];
      }),
    [categories],
  );

  const featuredCategoryIds = useMemo(
    () => featuredCategories.map((category: Category) => category.id),
    [featuredCategories],
  );

  // Fetch product counts for all categories (includes search filter)
  const { data: categoryCounts = {} as Record<number, number>, isLoading: countsLoading } = useQuery({
    queryKey: ["category-counts", featuredCategoryIds, selectedFilters.search],
    queryFn: async ({ signal }) => {
      if (featuredCategories.length === 0) return {};

      const countPromises = featuredCategories.map((category: Category) =>
        catalogServices
          .getProductCount(
            {
              category_id: category.id,
              search: selectedFilters.search || undefined,
            },
            { signal },
          )
          .then((response: { count: number }) => ({ id: category.id, count: response.count }))
          .catch(() => ({ id: category.id, count: 0 })),
      );

      const counts = await Promise.all(countPromises);
      return counts.reduce(
        (acc: Record<number, number>, { id, count }) => {
          acc[id] = count;
          return acc;
        },
        {} as Record<number, number>,
      );
    },
    enabled: featuredCategories.length > 0,
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

  const { data: priceBounds = { max: 0 }, isLoading: priceBoundsLoading } = useQuery({
    queryKey: [
      "price-bounds",
      priceBoundsFilters,
    ],
    queryFn: async ({ signal }) => {
      const response = await productServices.getProductsWithFilters(1, 1, "price-high-low", priceBoundsFilters, { signal });
      const max = parseFloat(String(response?.results?.[0]?.price ?? 0));

      return { max: Number.isFinite(max) ? Math.ceil(max) : 0 };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const isLoading =
    categoriesLoading || audiencesLoading || gameTypesLoading || brandsLoading || countsLoading || priceBoundsLoading;

  const priceCeiling = Math.max(0, priceBounds.max);
  const displayedMaxPrice = Number.isFinite(selectedFilters.priceRange.max) ? selectedFilters.priceRange.max : priceCeiling;
  const hasPriceFilter = selectedFilters.priceRange.min > 0 || Number.isFinite(selectedFilters.priceRange.max);

  const normalizeStoredMaxPrice = useCallback(
    (value: number) => {
      if (priceCeiling === 0) return 0;
      return value >= priceCeiling ? Number.POSITIVE_INFINITY : value;
    },
    [priceCeiling],
  );

  const updatePriceRange = (nextMin: number, nextMax: number) => {
    const clampedMin = Math.max(0, Math.min(nextMin, priceCeiling));
    const clampedMax = Math.max(clampedMin, Math.min(nextMax, priceCeiling));

    setSelectedFilters({
      ...selectedFilters,
      priceRange: {
        min: clampedMin,
        max: normalizeStoredMaxPrice(clampedMax),
      },
    });
  };

  useEffect(() => {
    if (priceBoundsLoading) return;

    const nextMin = Math.max(0, Math.min(selectedFilters.priceRange.min, priceCeiling));
    const nextDisplayedMax = Math.max(nextMin, Math.min(displayedMaxPrice, priceCeiling));
    const nextStoredMax = normalizeStoredMaxPrice(nextDisplayedMax);

    if (nextMin !== selectedFilters.priceRange.min || nextStoredMax !== selectedFilters.priceRange.max) {
      setSelectedFilters({
        ...selectedFilters,
        priceRange: {
          min: nextMin,
          max: nextStoredMax,
        },
      });
    }
  }, [
    displayedMaxPrice,
    normalizeStoredMaxPrice,
    priceBoundsLoading,
    priceCeiling,
    selectedFilters,
    setSelectedFilters,
  ]);

  useEffect(() => {
    if (categoriesLoading) return;

    const nextCategoryIds = selectedFilters.categories.filter((id) => featuredCategoryIds.includes(id));

    if (nextCategoryIds.length !== selectedFilters.categories.length) {
      setSelectedFilters((previousFilters) => ({
        ...previousFilters,
        categories: previousFilters.categories.filter((id) => featuredCategoryIds.includes(id)),
      }));
    }
  }, [categoriesLoading, featuredCategoryIds, selectedFilters.categories, setSelectedFilters]);

  // Toggle filter value with scroll position preservation
  const toggleFilter = (filterType: string, value: number | string, event?: React.SyntheticEvent): void => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentFilter = selectedFilters[filterType as keyof SelectedFilters];
    const filterArray = Array.isArray(currentFilter) ? currentFilter : [];

    const hasValue = filterArray.some((item) => item === value);
    const newFilterArray = hasValue ? filterArray.filter((item) => item !== value) : [...filterArray, value as never];

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: newFilterArray,
    } as SelectedFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      gameTypes: [],
      audiences: [],
      brands: [],
      priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
      sortBy: "relevance",
      search: "",
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    Object.entries(selectedFilters)
      .filter(([key]) => !["priceRange", "sortBy", "search"].includes(key))
      .some(([, values]) => values.length > 0) ||
    hasPriceFilter ||
    selectedFilters.search ||
    (selectedFilters.sortBy && selectedFilters.sortBy !== "relevance");

  const clampedMinPrice = Math.max(0, Math.min(selectedFilters.priceRange.min, priceCeiling));
  const clampedMaxPrice = Math.max(clampedMinPrice, Math.min(displayedMaxPrice, priceCeiling));
  const minPricePercent = priceCeiling > 0 ? (clampedMinPrice / priceCeiling) * 100 : 0;
  const maxPricePercent = priceCeiling > 0 ? (clampedMaxPrice / priceCeiling) * 100 : 0;

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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (filterType === "categories" && item.id) {
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
              onChange={handleCheckboxChange}
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
        {count !== null && <span className="text-base font-normal text-[#717171]">{count}</span>}
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
      <div className="flex w-full flex-col items-start gap-6 bg-white p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] lg:w-[247px]">
        {/* Header with toggle arrow */}
        <div className="flex flex-row justify-between items-center w-full">
          <h4 className="text-base font-medium uppercase text-black font-['Noto_Sans_JP']">{title}</h4>
          <button
            type="button"
            onClick={handleToggleExpanded}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70"
          >
            <ChevronDownIcon className="w-6 h-6" isExpanded={!isExpanded} />
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
    <section className="w-full max-w-[396px] mx-auto flex-shrink-0 lg:mx-0 lg:w-[247px] lg:max-w-none">
      {/* Mobile Filter Toggle */}
      <button
        type="button"
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        className="mb-6 flex h-12 w-full items-center justify-between  border border-[#494791] bg-white px-4 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Image src="/icons/filter.svg" alt="" width={20} height={20} className="h-5 w-5" aria-hidden="true" />
          <span className="text-base font-medium uppercase text-black">Filters</span>
        </div>
        <ChevronDownIcon className="w-6 h-6" isExpanded={!isMobileFiltersOpen} />
      </button>

      {/* Filter content - hidden on mobile unless toggled */}
      <div className={`${isMobileFiltersOpen ? "flex" : "hidden"} flex-col gap-6 lg:flex`}>
        {/* Active Filters Display Card */}
        {hasActiveFilters && (
          <div className="flex flex-col gap-6 bg-white p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
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
            <div className="flex flex-wrap gap-2" style={{ overflowAnchor: "none" }}>
              {selectedFilters.categories.map((id: number) => {
                const category = featuredCategories.find((cat: Category) => cat.id === id);
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
                      setSelectedFilters((prev: SelectedFilters) => ({ ...prev, search: "" }));
                    }}
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedFilters.sortBy && selectedFilters.sortBy !== "relevance" && (
                <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
                  Sort: {selectedFilters.sortBy.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  <button
                    type="button"
                    tabIndex={-1}
                    className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFilters((prev: SelectedFilters) => ({ ...prev, sortBy: "relevance" }));
                    }}
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              )}
              {hasPriceFilter && (
                <div className="bg-white border-[1px] border-[var(--color-light-purple-2)] p-2 text-[var(--color-purple)] text-sm flex justify-center items-center gap-2">
                  Price: ${clampedMinPrice} - ${clampedMaxPrice}
                  <button
                    type="button"
                    tabIndex={-1}
                    className="h-3 w-3 inline-block ml-1 cursor-pointer text-current hover:opacity-70"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFilters((prev: SelectedFilters) => ({
                        ...prev,
                        priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
                      }));
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
        <FilterSection title="FEATURED" items={featuredCategories} filterType="categories" />

        <FilterSection title="Game Types" items={gameTypes} filterType="gameTypes" />

        <FilterSection title="Audience" items={audiences} filterType="audiences" />

        <FilterSection title="Brands" items={brands} filterType="brands" />

        {/* Price Filter Card */}
        <div className="flex w-full flex-col items-start gap-4 bg-white p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] lg:w-[247px] lg:gap-6">
          <div className="flex flex-row justify-between items-center w-full">
            <h4 className="text-base font-medium uppercase text-black font-['Noto_Sans_JP']">Price</h4>
          </div>
          <div className="flex items-center justify-between gap-2 w-full">
            <input
              type="number"
              min="0"
              max={priceCeiling}
              placeholder="Min"
              value={clampedMinPrice}
              onChange={(e) => {
                const parsedValue = parseFloat(e.target.value);
                updatePriceRange(Number.isNaN(parsedValue) ? 0 : parsedValue, clampedMaxPrice);
              }}
              className="h-8 w-[88px] border border-[#494791] px-3 py-[6px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#494791] lg:h-10 lg:flex-1"
            />
            <span aria-hidden="true" className="block h-px w-[12px] bg-black" />
            <input
              type="number"
              min="0"
              max={priceCeiling}
              placeholder="Max"
              value={clampedMaxPrice}
              onChange={(e) => {
                const parsedValue = parseFloat(e.target.value);
                updatePriceRange(clampedMinPrice, Number.isNaN(parsedValue) ? priceCeiling : parsedValue);
              }}
              className="h-8 w-[88px] border border-[#494791] px-3 py-[6px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#494791] lg:h-10 lg:flex-1"
            />
          </div>
          <div className="relative h-4 w-full lg:hidden">
            <input
              type="range"
              min="0"
              max={priceCeiling}
              value={clampedMinPrice}
              disabled={priceCeiling === 0}
              onChange={(e) => updatePriceRange(parseFloat(e.target.value), clampedMaxPrice)}
              className="price-range-slider absolute inset-0 z-20 h-full w-full"
            />
            <input
              type="range"
              min="0"
              max={priceCeiling}
              value={clampedMaxPrice}
              disabled={priceCeiling === 0}
              onChange={(e) => updatePriceRange(clampedMinPrice, parseFloat(e.target.value))}
              className="price-range-slider absolute inset-0 z-30 h-full w-full"
            />
            <div className="absolute left-0 right-0 top-1/2 h-[6px] -translate-y-1/2 bg-[#A4A3C8]" />
            <div
              className="absolute top-1/2 h-[6px] -translate-y-1/2 bg-[#494791]"
              style={{
                left: `${minPricePercent}%`,
                width: `${Math.max(maxPricePercent - minPricePercent, 0)}%`,
              }}
            />
            <div
              className="absolute top-1/2 h-4 w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#494791]"
              style={{ left: `${minPricePercent}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#494791]"
              style={{ left: `${maxPricePercent}%` }}
            />
          </div>
          <style jsx>{`
            .price-range-slider {
              appearance: none;
              -webkit-appearance: none;
              background: transparent;
              pointer-events: none;
            }

            .price-range-slider::-webkit-slider-runnable-track {
              height: 100%;
              background: transparent;
            }

            .price-range-slider::-moz-range-track {
              height: 100%;
              background: transparent;
            }

            .price-range-slider::-webkit-slider-thumb {
              appearance: none;
              -webkit-appearance: none;
              height: 16px;
              width: 18px;
              border: 0;
              border-radius: 9999px;
              background: transparent;
              cursor: pointer;
              margin-top: 0;
              pointer-events: auto;
            }

            .price-range-slider::-moz-range-thumb {
              height: 16px;
              width: 18px;
              border: 0;
              border-radius: 9999px;
              background: transparent;
              cursor: pointer;
              pointer-events: auto;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

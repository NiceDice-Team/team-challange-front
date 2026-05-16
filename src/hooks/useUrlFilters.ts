"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SelectedFilters } from "@/types/catalog";

const DEFAULT_PAGE = 1;

type FiltersUpdate = SelectedFilters | ((filters: SelectedFilters) => SelectedFilters);

const parsePageParam = (pageParam: string | null): number => {
  const parsedPage = Number(pageParam);

  if (!Number.isInteger(parsedPage) || parsedPage < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return parsedPage;
};

export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getInitialFilters = useCallback((): SelectedFilters => {
    const categories =
      searchParams
        .get("categories")
        ?.split(",")
        .filter(Boolean)
        .map((id) => parseInt(id, 10))
        .filter((id) => Number.isFinite(id)) || [];
    const gameTypes = searchParams.get("types")?.split(",").filter(Boolean) || [];
    const audiences = searchParams.get("audiences")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");
    const minPrice =
      minPriceParam !== null && !Number.isNaN(parseFloat(minPriceParam))
        ? parseFloat(minPriceParam)
        : 0;
    const maxPrice =
      maxPriceParam !== null && !Number.isNaN(parseFloat(maxPriceParam))
        ? parseFloat(maxPriceParam)
        : Number.POSITIVE_INFINITY;
    const sortBy = searchParams.get("sort") || "relevance";
    const search = searchParams.get("search") || "";

    return {
      categories,
      gameTypes,
      audiences,
      brands,
      priceRange: { min: minPrice, max: maxPrice },
      sortBy,
      search,
    };
  }, [searchParams]);

  const getInitialPage = useCallback(() => {
    return parsePageParam(searchParams.get("page"));
  }, [searchParams]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(getInitialFilters);
  const [currentPage, setCurrentPageState] = useState<number>(getInitialPage);

  const createQueryString = useCallback((filters: SelectedFilters, page = DEFAULT_PAGE) => {
    const params = new URLSearchParams();

    if (filters.categories?.length > 0) {
      params.set("categories", filters.categories.join(","));
    }
    if (filters.gameTypes?.length > 0) {
      params.set("types", filters.gameTypes.join(","));
    }
    if (filters.audiences?.length > 0) {
      params.set("audiences", filters.audiences.join(","));
    }
    if (filters.brands?.length > 0) {
      params.set("brand", filters.brands.join(","));
    }
    if (filters.priceRange?.min > 0) {
      params.set("min_price", filters.priceRange.min.toString());
    }
    if (Number.isFinite(filters.priceRange?.max)) {
      params.set("max_price", filters.priceRange.max.toString());
    }
    if (filters.sortBy && filters.sortBy !== "relevance") {
      params.set("sort", filters.sortBy);
    }
    if (filters.search) {
      params.set("search", filters.search);
    }
    if (page > DEFAULT_PAGE) {
      params.set("page", page.toString());
    }

    return params.toString();
  }, []);

  const replaceUrl = useCallback(
    (filters: SelectedFilters, page = DEFAULT_PAGE) => {
      const queryString = createQueryString(filters, page);
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  const updateFilters = useCallback(
    (newFilters: FiltersUpdate) => {
      setCurrentPageState(DEFAULT_PAGE);

      setSelectedFilters((prevFilters) => {
        const resolvedFilters =
          typeof newFilters === "function" ? newFilters(prevFilters) : newFilters;

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          replaceUrl(resolvedFilters, DEFAULT_PAGE);
        }, 300);

        return resolvedFilters;
      });
    },
    [replaceUrl],
  );

  const updatePage = useCallback(
    (page: number) => {
      const nextPage = Number.isInteger(page) && page >= DEFAULT_PAGE ? page : DEFAULT_PAGE;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      setCurrentPageState(nextPage);
      replaceUrl(selectedFilters, nextPage);
    },
    [replaceUrl, selectedFilters],
  );

  useEffect(() => {
    setSelectedFilters(getInitialFilters());
    setCurrentPageState(getInitialPage());
  }, [getInitialFilters, getInitialPage]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    selectedFilters,
    currentPage,
    updateFilters,
    setSelectedFilters: updateFilters,
    setCurrentPage: updatePage,
  };
};

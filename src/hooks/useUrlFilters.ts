"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  parseCatalogFiltersFromSearchParams,
  parsePageParam,
  serializeCatalogFiltersToQueryString,
  shouldNormalizeCatalogQuery,
} from "@/lib/catalogQueryParams";
import type { SelectedFilters } from "@/types/catalog";

const DEFAULT_PAGE = 1;

type FiltersUpdate = SelectedFilters | ((filters: SelectedFilters) => SelectedFilters);

export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getInitialFilters = useCallback((): SelectedFilters => {
    return parseCatalogFiltersFromSearchParams(searchParams);
  }, [searchParams]);

  const getInitialPage = useCallback(() => {
    return parsePageParam(searchParams.get("page"));
  }, [searchParams]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(getInitialFilters);
  const [currentPage, setCurrentPageState] = useState<number>(getInitialPage);

  const createQueryString = useCallback((filters: SelectedFilters, page = DEFAULT_PAGE) => {
    return serializeCatalogFiltersToQueryString(filters, page);
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
    if (!shouldNormalizeCatalogQuery(searchParams)) {
      return;
    }

    const sanitizedFilters = parseCatalogFiltersFromSearchParams(searchParams);
    const sanitizedPage = parsePageParam(searchParams.get("page"));
    const sanitizedQuery = serializeCatalogFiltersToQueryString(
      sanitizedFilters,
      sanitizedPage,
    );
    const url = sanitizedQuery ? `${pathname}?${sanitizedQuery}` : pathname;

    router.replace(url, { scroll: false });
  }, [pathname, router, searchParams]);

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

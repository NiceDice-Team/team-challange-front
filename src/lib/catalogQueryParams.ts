import type { SelectedFilters, SortOption } from "@/types/catalog";

const POSITIVE_INT_PATTERN = /^\d+$/;
const UNSAFE_QUERY_VALUE_PATTERN = /[<>"'`\\]/;
const DEFAULT_PAGE = 1;

const SORT_OPTIONS: readonly SortOption[] = [
  "relevance",
  "bestsellers",
  "price-high-low",
  "price-low-high",
  "newest",
] as const;

const CATEGORY_PAGE_TITLES: Record<number, string> = {
  1: "New arrivals",
  2: "Bestsellers",
  4: "Sale",
  5: "Coming soon",
};

export const DEFAULT_CATALOG_PAGE_TITLE = "Board games";

const MAX_FILTER_TOKEN_LENGTH = 100;
const MAX_SEARCH_LENGTH = 200;

export function parsePositiveIntList(value: string | null | undefined): number[] {
  if (!value) {
    return [];
  }

  const parsedIds = value
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      if (!POSITIVE_INT_PATTERN.test(segment)) {
        return null;
      }

      const parsed = Number(segment);

      if (!Number.isSafeInteger(parsed) || parsed <= 0) {
        return null;
      }

      return parsed;
    })
    .filter((id): id is number => id !== null);

  return [...new Set(parsedIds)];
}

export function parseSafeFilterToken(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed.length > MAX_FILTER_TOKEN_LENGTH) {
    return null;
  }

  if (UNSAFE_QUERY_VALUE_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function parseSafeFilterTokenList(
  value: string | null | undefined,
): string[] {
  if (!value) {
    return [];
  }

  const tokens = value
    .split(",")
    .map(parseSafeFilterToken)
    .filter((token): token is string => token !== null);

  return [...new Set(tokens)];
}

export function parseSortOption(value: string | null | undefined): SortOption {
  if (!value) {
    return "relevance";
  }

  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "relevance";
}

export function parseSearchQuery(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim().slice(0, MAX_SEARCH_LENGTH);

  if (UNSAFE_QUERY_VALUE_PATTERN.test(trimmed)) {
    return "";
  }

  return trimmed;
}

export function parsePriceParam(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value.trim() === "") {
    return null;
  }

  if (!/^-?\d+(\.\d+)?$/.test(value.trim())) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function parsePageParam(value: string | null | undefined): number {
  const parsedPage = Number(value);

  if (!Number.isInteger(parsedPage) || parsedPage < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return parsedPage;
}

export function parseCatalogFiltersFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): SelectedFilters {
  const minPrice = parsePriceParam(searchParams.get("min_price"));
  const maxPrice = parsePriceParam(searchParams.get("max_price"));

  return {
    categories: parsePositiveIntList(searchParams.get("categories")),
    gameTypes: parseSafeFilterTokenList(searchParams.get("types")),
    audiences: parseSafeFilterTokenList(searchParams.get("audiences")),
    brands: parseSafeFilterTokenList(searchParams.get("brand")),
    priceRange: {
      min: minPrice ?? 0,
      max: maxPrice ?? Number.POSITIVE_INFINITY,
    },
    sortBy: parseSortOption(searchParams.get("sort")),
    search: parseSearchQuery(searchParams.get("search")),
  };
}

export function serializeCatalogFiltersToQueryString(
  filters: SelectedFilters,
  page = DEFAULT_PAGE,
): string {
  const params = new URLSearchParams();

  const categories = filters.categories.filter(
    (id) => Number.isSafeInteger(id) && id > 0,
  );

  if (categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  const gameTypes = filters.gameTypes
    .map(parseSafeFilterToken)
    .filter((token): token is string => token !== null);

  if (gameTypes.length > 0) {
    params.set("types", gameTypes.join(","));
  }

  const audiences = filters.audiences
    .map(parseSafeFilterToken)
    .filter((token): token is string => token !== null);

  if (audiences.length > 0) {
    params.set("audiences", audiences.join(","));
  }

  const brands = filters.brands
    .map(parseSafeFilterToken)
    .filter((token): token is string => token !== null);

  if (brands.length > 0) {
    params.set("brand", brands.join(","));
  }

  if (filters.priceRange.min > 0) {
    params.set("min_price", filters.priceRange.min.toString());
  }

  if (Number.isFinite(filters.priceRange.max)) {
    params.set("max_price", filters.priceRange.max.toString());
  }

  const sortBy = parseSortOption(filters.sortBy);

  if (sortBy !== "relevance") {
    params.set("sort", sortBy);
  }

  const search = parseSearchQuery(filters.search);

  if (search) {
    params.set("search", search);
  }

  if (page > DEFAULT_PAGE) {
    params.set("page", page.toString());
  }

  return params.toString();
}

function areSearchParamsEqual(
  left: URLSearchParams,
  right: URLSearchParams,
): boolean {
  const leftKeys = [...new Set(left.keys())].sort();
  const rightKeys = [...new Set(right.keys())].sort();

  if (
    leftKeys.length !== rightKeys.length ||
    leftKeys.some((key, index) => key !== rightKeys[index])
  ) {
    return false;
  }

  return leftKeys.every((key) => left.get(key) === right.get(key));
}

export function getCatalogPageTitle(filters: SelectedFilters): string {
  if (filters.categories.length === 1) {
    const categoryTitle = CATEGORY_PAGE_TITLES[filters.categories[0]];
    if (categoryTitle) {
      return categoryTitle;
    }
  }

  if (filters.categories.length === 0) {
    if (filters.sortBy === "bestsellers") {
      return "Bestsellers";
    }
    if (filters.sortBy === "newest") {
      return "New arrivals";
    }
  }

  return DEFAULT_CATALOG_PAGE_TITLE;
}

export function shouldNormalizeCatalogQuery(searchParams: URLSearchParams): boolean {
  const sanitizedFilters = parseCatalogFiltersFromSearchParams(searchParams);
  const sanitizedPage = parsePageParam(searchParams.get("page"));
  const canonicalQuery = serializeCatalogFiltersToQueryString(
    sanitizedFilters,
    sanitizedPage,
  );
  const canonicalParams = new URLSearchParams(canonicalQuery);

  return !areSearchParamsEqual(searchParams, canonicalParams);
}

import {
  DEFAULT_CATALOG_PAGE_TITLE,
  getCatalogPageTitle,
  parseCatalogFiltersFromSearchParams,
  parsePositiveIntList,
  parseSafeFilterTokenList,
  parseSearchQuery,
  parseSortOption,
  serializeCatalogFiltersToQueryString,
  shouldNormalizeCatalogQuery,
} from "@/lib/catalogQueryParams";
import type { SelectedFilters } from "@/types/catalog";

const emptyFilters: SelectedFilters = {
  categories: [],
  gameTypes: [],
  audiences: [],
  brands: [],
  priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
  sortBy: "relevance",
  search: "",
};

describe("catalogQueryParams", () => {
  describe("parsePositiveIntList", () => {
    test("accepts valid positive integer ids", () => {
      expect(parsePositiveIntList("1")).toEqual([1]);
      expect(parsePositiveIntList("1,2,3")).toEqual([1, 2, 3]);
    });

    test("rejects crafted XSS payloads in categories", () => {
      expect(parsePositiveIntList('1"><script>alert(1)</script>')).toEqual([]);
      expect(parsePositiveIntList("1,<img src=x onerror=alert(1)>")).toEqual([1]);
      expect(parsePositiveIntList("abc")).toEqual([]);
      expect(parsePositiveIntList("1.5")).toEqual([]);
      expect(parsePositiveIntList("-1")).toEqual([]);
      expect(parsePositiveIntList("01")).toEqual([1]);
    });

    test("deduplicates category ids", () => {
      expect(parsePositiveIntList("1,1,2")).toEqual([1, 2]);
    });
  });

  describe("parseSafeFilterTokenList", () => {
    test("rejects unsafe filter tokens", () => {
      expect(parseSafeFilterTokenList('dice"><script>alert(1)</script>')).toEqual([]);
      expect(parseSafeFilterTokenList("family,co-op")).toEqual(["family", "co-op"]);
    });
  });

  describe("parseSearchQuery", () => {
    test("rejects unsafe search values", () => {
      expect(parseSearchQuery('catan"><img src=x onerror=alert(1)>')).toBe("");
      expect(parseSearchQuery("  dice  ")).toBe("dice");
    });
  });

  describe("parseSortOption", () => {
    test("allows only known sort values", () => {
      expect(parseSortOption("price-high-low")).toBe("price-high-low");
      expect(parseSortOption("javascript:alert(1)")).toBe("relevance");
    });
  });

  describe("parseCatalogFiltersFromSearchParams", () => {
    test("sanitizes malicious catalog query params", () => {
      const params = new URLSearchParams(
        'categories=1"><script>alert(1)</script>&search=<img>&sort=hack&types=bad"token',
      );

      expect(parseCatalogFiltersFromSearchParams(params)).toEqual({
        categories: [],
        gameTypes: [],
        audiences: [],
        brands: [],
        priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
        sortBy: "relevance",
        search: "",
      });
    });

    test("keeps valid catalog filters", () => {
      const params = new URLSearchParams(
        "categories=1,2&search=dice&sort=newest&brand=Hasbro&min_price=10&max_price=50&page=2",
      );

      expect(parseCatalogFiltersFromSearchParams(params)).toEqual({
        categories: [1, 2],
        gameTypes: [],
        audiences: [],
        brands: ["Hasbro"],
        priceRange: { min: 10, max: 50 },
        sortBy: "newest",
        search: "dice",
      });
    });
  });

  describe("serializeCatalogFiltersToQueryString", () => {
    test("writes only validated values", () => {
      const query = serializeCatalogFiltersToQueryString(
        {
          categories: [1, 2],
          gameTypes: ['bad"token'],
          audiences: [],
          brands: [],
          priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
          sortBy: "relevance",
          search: "dice",
        },
        1,
      );

      expect(query).toBe("categories=1%2C2&search=dice");
    });
  });

  describe("getCatalogPageTitle", () => {
    test("maps single category filters to navigation titles", () => {
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [1] })).toBe(
        "New arrivals",
      );
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [2] })).toBe(
        "Bestsellers",
      );
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [4] })).toBe(
        "Sale",
      );
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [5] })).toBe(
        "Coming soon",
      );
    });

    test("maps sort-only catalog routes to titles", () => {
      expect(
        getCatalogPageTitle({ ...emptyFilters, sortBy: "bestsellers" }),
      ).toBe("Bestsellers");
      expect(getCatalogPageTitle({ ...emptyFilters, sortBy: "newest" })).toBe(
        "New arrivals",
      );
    });

    test("falls back to the default board games title", () => {
      expect(getCatalogPageTitle(emptyFilters)).toBe(DEFAULT_CATALOG_PAGE_TITLE);
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [1, 2] })).toBe(
        DEFAULT_CATALOG_PAGE_TITLE,
      );
      expect(getCatalogPageTitle({ ...emptyFilters, categories: [3] })).toBe(
        DEFAULT_CATALOG_PAGE_TITLE,
      );
    });
  });

  describe("shouldNormalizeCatalogQuery", () => {
    test("detects unsafe query strings", () => {
      const params = new URLSearchParams('categories=1"><script>alert(1)</script>');

      expect(shouldNormalizeCatalogQuery(params)).toBe(true);
    });

    test("does not normalize equivalent valid query strings", () => {
      const params = new URLSearchParams("categories=1&search=dice");

      expect(shouldNormalizeCatalogQuery(params)).toBe(false);
    });
  });
});

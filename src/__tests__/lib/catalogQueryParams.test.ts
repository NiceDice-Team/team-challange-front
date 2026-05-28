import {
  parseCatalogFiltersFromSearchParams,
  parsePositiveIntList,
  parseSafeFilterTokenList,
  parseSearchQuery,
  parseSortOption,
  serializeCatalogFiltersToQueryString,
  shouldNormalizeCatalogQuery,
} from "@/lib/catalogQueryParams";

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

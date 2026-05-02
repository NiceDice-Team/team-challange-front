import { act, renderHook } from "@testing-library/react";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { SelectedFilters } from "@/types/catalog";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/catalog",
  useSearchParams: () => mockSearchParams,
}));

const defaultFilters: SelectedFilters = {
  categories: [],
  gameTypes: [],
  audiences: [],
  brands: [],
  priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
  sortBy: "relevance",
  search: "",
};

describe("useUrlFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("reads current page from the catalog URL", () => {
    mockSearchParams = new URLSearchParams("search=dice&page=3");

    const { result } = renderHook(() => useUrlFilters());

    expect(result.current.currentPage).toBe(3);
    expect(result.current.selectedFilters.search).toBe("dice");
  });

  test("writes page changes into the catalog URL", () => {
    mockSearchParams = new URLSearchParams("search=dice&page=3");

    const { result } = renderHook(() => useUrlFilters());

    act(() => {
      result.current.setCurrentPage(4);
    });

    expect(mockReplace).toHaveBeenCalledWith("/catalog?search=dice&page=4", {
      scroll: false,
    });
  });

  test("omits the page param for the default first page", () => {
    mockSearchParams = new URLSearchParams("search=dice&page=3");

    const { result } = renderHook(() => useUrlFilters());

    act(() => {
      result.current.setCurrentPage(1);
    });

    expect(mockReplace).toHaveBeenCalledWith("/catalog?search=dice", {
      scroll: false,
    });
  });

  test("resets page to one when filters change", () => {
    mockSearchParams = new URLSearchParams("search=dice&page=3");

    const { result } = renderHook(() => useUrlFilters());

    act(() => {
      result.current.setSelectedFilters({
        ...defaultFilters,
        search: "catan",
      });
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledWith("/catalog?search=catan", {
      scroll: false,
    });
  });
});

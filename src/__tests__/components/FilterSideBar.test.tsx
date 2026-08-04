import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FilterSideBar from "@/components/catalog/FilterSideBar";
import { catalogServices } from "@/services/catalogServices";
import { productServices } from "@/services/productServices";
import type { SelectedFilters } from "@/types/catalog";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

jest.mock("@/services/catalogServices", () => ({
  catalogServices: {
    getCategories: jest.fn(),
    getAudiences: jest.fn(),
    getGameTypes: jest.fn(),
    getBrands: jest.fn(),
    getProductCount: jest.fn(),
  },
}));

jest.mock("@/services/productServices", () => ({
  productServices: {
    getProductsWithFilters: jest.fn(),
  },
}));

const mockedCatalogServices = catalogServices as jest.Mocked<typeof catalogServices>;
const mockedProductServices = productServices as jest.Mocked<typeof productServices>;

const defaultFilters: SelectedFilters = {
  categories: [],
  gameTypes: [],
  audiences: [],
  brands: [],
  priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
  sortBy: "relevance",
  search: "",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe("FilterSideBar featured categories", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedCatalogServices.getCategories.mockResolvedValue([
      { id: 1, name: "New arrivals" },
      { id: 2, name: "Bestsellers" },
      { id: 3, name: "Board games" },
      { id: 4, name: "Sale" },
      { id: 5, name: "Coming soon" },
      { id: 6, name: "Sold out" },
      { id: 7, name: "Accessories" },
    ] as any);
    mockedCatalogServices.getAudiences.mockResolvedValue([]);
    mockedCatalogServices.getGameTypes.mockResolvedValue([]);
    mockedCatalogServices.getBrands.mockResolvedValue([]);
    mockedCatalogServices.getProductCount.mockImplementation(async ({ category_id }) => ({
      count: category_id,
    }) as any);
    mockedProductServices.getProductsWithFilters.mockResolvedValue({
      results: [{ price: "100" }],
    } as any);
  });

  test("shows only allowed featured categories and renames the section", async () => {
    render(<FilterSideBar selectedFilters={defaultFilters} setSelectedFilters={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText("FEATURED")).toBeInTheDocument();
    });

    expect(screen.queryByText("Categories")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New arrivals" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sale" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Coming soon" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Bestsellers" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Board games" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sold out" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Accessories" })).not.toBeInTheDocument();
  });

  test("keeps bestsellers category from navigation links", async () => {
    const setSelectedFilters = jest.fn();

    render(
      <FilterSideBar
        selectedFilters={{ ...defaultFilters, categories: [2] }}
        setSelectedFilters={setSelectedFilters}
      />,
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(mockedCatalogServices.getCategories).toHaveBeenCalled();
    });

    expect(setSelectedFilters).not.toHaveBeenCalled();
  });

  test("collapses mobile filters by default and toggles them without reloading", async () => {
    const user = userEvent.setup();

    render(<FilterSideBar selectedFilters={defaultFilters} setSelectedFilters={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const skeletonContent = document.getElementById("catalog-filter-skeleton-content");
    expect(skeletonContent).toHaveClass("hidden", "lg:flex");

    const mobileFilterToggle = await screen.findByRole("button", { name: /filters/i });
    const filterContent = document.getElementById("catalog-filter-content");
    const getToggleIcon = () => mobileFilterToggle.querySelector("svg");

    expect(mobileFilterToggle).toHaveAttribute("aria-controls", "catalog-filter-content");
    expect(mobileFilterToggle).toHaveAttribute("aria-expanded", "false");
    expect(filterContent).toHaveClass("hidden", "lg:flex");
    expect(filterContent).not.toHaveClass("flex");
    expect(getToggleIcon()).toHaveClass("rotate-0");

    await user.click(mobileFilterToggle);

    expect(mobileFilterToggle).toHaveAttribute("aria-expanded", "true");
    expect(filterContent).toHaveClass("flex", "lg:flex");
    expect(filterContent).not.toHaveClass("hidden");
    expect(getToggleIcon()).toHaveClass("rotate-180");

    await user.click(mobileFilterToggle);

    expect(mobileFilterToggle).toHaveAttribute("aria-expanded", "false");
    expect(filterContent).toHaveClass("hidden", "lg:flex");
    expect(filterContent).not.toHaveClass("flex");
    expect(getToggleIcon()).toHaveClass("rotate-0");
  });

  test("truncates a long search filter without expanding the active filters container", async () => {
    const longSearch = "a".repeat(120);
    const fullSearchLabel = `Search: "${longSearch}"`;

    render(
      <FilterSideBar
        selectedFilters={{ ...defaultFilters, search: longSearch }}
        setSelectedFilters={jest.fn()}
      />,
      { wrapper: createWrapper() },
    );

    const searchLabel = await screen.findByText(fullSearchLabel);

    expect(searchLabel).toHaveClass("min-w-0", "truncate");
    expect(searchLabel.parentElement).toHaveClass("relative", "min-w-0", "flex-1");
    expect(searchLabel.parentElement?.parentElement).toHaveClass("max-w-full", "min-w-0");
    expect(screen.getByRole("button", { name: "Remove search filter" })).toHaveClass("shrink-0");

    Object.defineProperties(searchLabel, {
      clientWidth: { configurable: true, value: 180 },
      scrollWidth: { configurable: true, value: 900 },
    });

    fireEvent.mouseEnter(searchLabel);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent(fullSearchLabel);
    expect(tooltip).toHaveClass("text-white", "shadow-[0px_13px_28px_rgba(0,0,0,0.1)]");
    expect(tooltip.querySelector("svg")).toBeInTheDocument();
    expect(searchLabel).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.mouseLeave(searchLabel);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(searchLabel);
    expect(screen.getByRole("tooltip")).toHaveTextContent(fullSearchLabel);
  });
});

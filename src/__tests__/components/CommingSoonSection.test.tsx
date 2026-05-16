import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import CommingSoonSection from "@/components/home/CommingSoonSection";
import { catalogServices } from "@/services/catalogServices";
import { productServices } from "@/services/productServices";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} className={className} src={src} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

jest.mock("@/services/catalogServices", () => ({
  catalogServices: {
    getCategories: jest.fn(),
  },
}));

jest.mock("@/services/productServices", () => ({
  productServices: {
    getProductsWithFilters: jest.fn(),
  },
}));

const mockedCatalogServices = catalogServices as jest.Mocked<typeof catalogServices>;
const mockedProductServices = productServices as jest.Mocked<typeof productServices>;

describe("CommingSoonSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders real coming soon products from the backend category", async () => {
    mockedCatalogServices.getCategories.mockResolvedValue([
      { id: 1, name: "New arrivals" },
      { id: 5, name: "  Coming   soon " },
    ] as any);
    mockedProductServices.getProductsWithFilters.mockResolvedValue({
      results: [
        {
          id: 34,
          name: "Ticket to Ride: Legacy",
          images: [
            {
              id: 129,
              url_sm: "https://cdn.bgshop.work.gd/products/sm/ticket.webp",
              alt: "Ticket to Ride box",
            },
          ],
        },
      ],
    } as any);

    render(await CommingSoonSection());

    expect(screen.getByRole("heading", { name: "Coming soon" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ticket to Ride: Legacy" })).toBeInTheDocument();
    const productImage = screen.getByRole("img", { name: "Ticket to Ride box" });
    expect(productImage).toHaveAttribute(
      "src",
      "https://cdn.bgshop.work.gd/products/sm/ticket.webp",
    );
    expect(productImage).toHaveClass("object-contain");
    expect(productImage).not.toHaveClass("object-cover");
    expect(screen.getByRole("link", { name: "Ticket to Ride box" })).toHaveAttribute("href", "/product/34");
    expect(screen.getByRole("link", { name: "Learn more →" })).toHaveAttribute("href", "/product/34");
    expect(screen.queryByText(/Game Title/i)).not.toBeInTheDocument();
    expect(mockedProductServices.getProductsWithFilters).toHaveBeenCalledWith(
      1,
      4,
      "relevance",
      { categories: [5] },
    );
  });

  test("renders an empty state when there are no real coming soon games", async () => {
    mockedCatalogServices.getCategories.mockResolvedValue([{ id: 5, name: "Coming soon" }] as any);
    mockedProductServices.getProductsWithFilters.mockResolvedValue({ results: [] } as any);

    render(await CommingSoonSection());

    expect(screen.getByText("There are no games coming soon right now.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Learn more →" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Game Title/i)).not.toBeInTheDocument();
  });

  test("renders an empty state when coming soon products have no real images", async () => {
    mockedCatalogServices.getCategories.mockResolvedValue([{ id: 5, name: "Coming soon" }] as any);
    mockedProductServices.getProductsWithFilters.mockResolvedValue({
      results: [{ id: 34, name: "Ticket to Ride: Legacy", images: [] }],
    } as any);

    render(await CommingSoonSection());

    expect(screen.getByText("There are no games coming soon right now.")).toBeInTheDocument();
    expect(screen.queryByText("Ticket to Ride: Legacy")).not.toBeInTheDocument();
  });
});

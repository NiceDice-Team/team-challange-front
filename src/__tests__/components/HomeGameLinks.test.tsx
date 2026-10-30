import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import HeroScroller, { HERO_SCROLLER_ITEMS } from "@/components/home/HeroScroller";
import NewArrivals from "@/components/home/NewArrivals";
import ReviewSection from "@/components/home/ReviewSection";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => {
    return <img alt={alt} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

jest.mock("@/services/reviewServices", () => ({
  reviewServices: {
    getReviews: jest.fn(),
  },
}));

jest.mock("@/services/productServices", () => ({
  productServices: {
    getProductById: jest.fn(),
  },
}));

const mockedReviewServices = reviewServices as jest.Mocked<typeof reviewServices>;
const mockedProductServices = productServices as jest.Mocked<typeof productServices>;

describe("home game links", () => {
  test("points hero slide CTAs at their matching game routes", () => {
    expect(HERO_SCROLLER_ITEMS.map((item) => item.buttonHref)).toEqual([
      "/catalog?search=Heat",
      "/product/7",
      "/product/8",
    ]);

    render(<HeroScroller />);

    expect(screen.getByRole("link", { name: "BUY NOW" })).toHaveAttribute("href", "/catalog?search=Heat");
  });

  test("points product promo links at existing catalog routes", () => {
    render(<NewArrivals />);

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => href !== null);

    expect(hrefs).toEqual([
      "/catalog?categories=1",
      "/catalog?categories=2",
      "/catalog?categories=4",
      "/catalog",
    ]);
    hrefs.forEach((href) => {
      expect(href).not.toMatch(/^\/products\//);
    });
  });

  test("points review game links at product pages from the reviews response", async () => {
    mockedReviewServices.getReviews.mockResolvedValue({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 56,
          product_id: 7,
          user_id: 295,
          user_name: "olha K.",
          rating: 5,
          comment: "Catan is a fun and engaging board game.",
          created_at: "2026-10-25T16:14:12.347479Z",
        },
        {
          id: 57,
          product_id: 8,
          user_name: "Emma R.",
          rating: 4,
          comment: "The components feel sturdy.",
          created_at: "2026-03-19T12:00:00.000Z",
        },
      ],
    });
    mockedProductServices.getProductById.mockImplementation(async (id) => ({
      id: Number(id),
      name: Number(id) === 7 ? "Catan" : "Azul",
      price: "10.00",
      stock: "1",
    }));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ReviewSection />
      </QueryClientProvider>,
    );

    const productLinks = await screen.findAllByRole("link", { name: /About/ });
    const hrefs = productLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual(expect.arrayContaining(["/product/7", "/product/8"]));
    hrefs.forEach((href) => {
      expect(href).toMatch(/^\/product\/\d+$/);
    });
  });
});

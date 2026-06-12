import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductCard from "@/components/catalog/ProductCard";
import { reviewServices } from "@/services/reviewServices";
import type { Product } from "@/types/product";

const mockMutateAsync = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, fill, priority, unoptimized, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === "string" ? src : ""} {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/svgs/icons", () => ({
  StarEmptyIcon: "/icons/star-empty.svg",
  StarFilledIcon: "/icons/star-filled.svg",
  CircleRedIcon: "/icons/circle-red.svg",
  CircleOrangeIcon: "/icons/circle-orange.svg",
  CircleGreenIcon: "/icons/circle-green.svg",
  CircleGrayIcon: "/icons/circle-gray.svg",
}));

jest.mock("@/hooks/useCartQuery", () => ({
  useAddToCart: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock("@/services/reviewServices", () => ({
  reviewServices: {
    getAllProductReviews: jest.fn(),
  },
}));

const mockedReviewServices = reviewServices as jest.Mocked<typeof reviewServices>;

const renderWithQueryClient = (product: Product) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProductCard product={product} />
    </QueryClientProvider>
  );
};

const product: Product = {
  id: 30,
  name: "UNO Flip",
  price: "15.99",
  stock: 15,
  stars: "0.00",
  images: [],
  reviews: [8],
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses nested review summary when catalog stars are stale", async () => {
    mockedReviewServices.getAllProductReviews.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 8, rating: "4.00", comment: "", created_at: "2025-05-19T13:54:33Z" }],
    });

    renderWithQueryClient(product);

    await waitFor(() => {
      expect(mockedReviewServices.getAllProductReviews).toHaveBeenCalledWith(
        "30",
        {},
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    await waitFor(() => {
      expect(screen.getAllByAltText("filled star")).toHaveLength(4);
    });
    expect(screen.getByText("(1)")).toBeInTheDocument();
  });

  test("uses catalog stars without fetching when aggregate rating is present", () => {
    renderWithQueryClient({
      ...product,
      id: 31,
      stars: "3.00",
    });

    expect(screen.getAllByAltText("filled star")).toHaveLength(3);
    expect(mockedReviewServices.getAllProductReviews).not.toHaveBeenCalled();
  });

  test("renders a half star for half-step ratings", () => {
    renderWithQueryClient({
      ...product,
      id: 32,
      stars: "4.50",
    });

    expect(screen.getAllByAltText("filled star")).toHaveLength(4);
    expect(screen.getByAltText("half star")).toBeInTheDocument();
    expect(mockedReviewServices.getAllProductReviews).not.toHaveBeenCalled();
  });

  test("renders product images inside the fixed card image area", () => {
    renderWithQueryClient({
      ...product,
      id: 34,
      images: [
        { id: 1, url_sm: "/uno.jpg", alt: "UNO Flip box" },
        { id: 2, url_sm: "/uno-detail.jpg", alt: "UNO detail" },
        { id: 3, url_sm: "/uno-cards.jpg", alt: "UNO cards" },
      ],
      reviews: [],
      stars: "4.00",
    });

    expect(screen.getByAltText("UNO Flip box")).toHaveClass("object-contain", "object-top");
    expect(screen.getByAltText("UNO Flip box")).not.toHaveClass("object-cover");
    expect(screen.getAllByRole("button", { name: /view image/i })).toHaveLength(3);
    expect(mockedReviewServices.getAllProductReviews).not.toHaveBeenCalled();
  });

  test("renders discounted price with original price struck through", () => {
    renderWithQueryClient({
      ...product,
      id: 33,
      discount: "20.00",
      reviews: [],
      stars: "4.00",
    });

    expect(screen.getByText("$12.79")).toHaveClass("text-[var(--color-red-price)]");
    expect(screen.getByText("$15.99")).toHaveClass("line-through");
    expect(mockedReviewServices.getAllProductReviews).not.toHaveBeenCalled();
  });
});

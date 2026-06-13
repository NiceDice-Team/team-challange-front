import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReviewsComments from "@/components/catalog/ReviewsComments";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";
import type { Product } from "@/types/product";

jest.mock("@/components/home/ReviewCard", () => ({
  __esModule: true,
  default: ({ name, body }: { name?: string; body: string }) => (
    <article>
      <h3>{name}</h3>
      <p>{body}</p>
    </article>
  ),
}));

jest.mock("@/components/shared/CustomSelect", () => ({
  CustomSelect: () => <button type="button">Most recent</button>,
}));

jest.mock("@/components/ui/pagination", () => ({
  Pagination: () => <nav>Pagination</nav>,
}));

jest.mock("@/services/productServices", () => ({
  productServices: {
    getProductById: jest.fn(),
  },
}));

jest.mock("@/services/reviewServices", () => ({
  reviewServices: {
    getAllProductReviews: jest.fn(),
  },
}));

const mockedProductServices = productServices as jest.Mocked<typeof productServices>;
const mockedReviewServices = reviewServices as jest.Mocked<typeof reviewServices>;

const product: Product = {
  id: 7,
  name: "Catan",
  price: "50.00",
  stock: "12",
  images: [],
  reviews: [],
};

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewsComments productId="7" />
    </QueryClientProvider>,
  );
};

describe("ReviewsComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedProductServices.getProductById.mockResolvedValue(product);
  });

  test("renders a neutral author fallback instead of the internal customer id", async () => {
    mockedReviewServices.getAllProductReviews.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          user_id: 12345,
          rating: "5.00",
          comment: "Great game",
          created_at: "2026-06-01T12:00:00Z",
        },
      ],
    });

    renderWithQueryClient();

    await waitFor(() => {
      expect(mockedReviewServices.getAllProductReviews).toHaveBeenCalledWith(
        "7",
        { ordering: "-created_at" },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    expect((await screen.findAllByText("Verified buyer")).length).toBeGreaterThan(0);
    expect(screen.queryByText("Customer #12345")).not.toBeInTheDocument();
  });
});

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductDetailPage from "../../app/(catalog)/product/[id]/page";
import LegacyProductDetailPage from "../../app/(catalog)/catalog/product/[id]/page";
import { productServices } from "@/services/productServices";
import { reviewServices } from "@/services/reviewServices";
import { catalogServices } from "@/services/catalogServices";

const mockRedirect = jest.fn();
const mockMutateAsync = jest.fn();
const mockUseAddToCart = jest.fn();

jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

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

jest.mock("@/components/layout/Navbar", () => ({
  __esModule: true,
  default: () => <nav data-testid="product-detail-navbar">Navbar</nav>,
}));

jest.mock("@/components/layout/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="product-detail-footer">Footer</footer>,
}));

jest.mock("@/components/catalog/ProductDetailMobileChrome", () => ({
  ProductDetailMobileHeader: () => <header data-testid="product-detail-mobile-header">Mobile header</header>,
  ProductDetailMobileFooter: () => <footer data-testid="product-detail-mobile-footer">Mobile footer</footer>,
}));

jest.mock("@/components/catalog/ReviewsProduct", () => ({
  __esModule: true,
  default: ({ productId }: { productId: string }) => (
    <section data-testid="reviews-summary">Reviews summary for {productId}</section>
  ),
}));

jest.mock("@/components/catalog/ReviewsComments", () => ({
  __esModule: true,
  default: ({ productId }: { productId: string }) => (
    <section data-testid="reviews-comments">Reviews comments for {productId}</section>
  ),
}));

jest.mock("@/hooks/useCartQuery", () => ({
  useAddToCart: () => mockUseAddToCart(),
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

jest.mock("@/services/catalogServices", () => ({
  catalogServices: {
    getBrandById: jest.fn(),
  },
}));

const mockedProductServices = productServices as jest.Mocked<typeof productServices>;
const mockedReviewServices = reviewServices as jest.Mocked<typeof reviewServices>;
const mockedCatalogServices = catalogServices as jest.Mocked<typeof catalogServices>;

const product = {
  id: 7,
  name: "Catan",
  brand: 5,
  price: "50.00",
  stock: "12",
  stars: "4",
  shortDescription: "Backend short summary for Catan.",
  description: "Backend full description for Catan.",
  gameInformation: {
    publisher: 2,
    players: "3-4",
    age: "10+",
    time: "45 minutes",
    includes: "Backend component list",
    gameFeatures: "Backend feature list",
  },
  deliveryAndPayment: "Backend delivery and payment details.",
  images: [
    {
      id: 1,
      url_sm: "/catan-sm.jpg",
      url_md: "/catan-md.jpg",
      url_lg: "/catan-lg.jpg",
      alt: "Catan box",
    },
  ],
  reviews: [],
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedProductServices.getProductById.mockResolvedValue(product as any);
    mockedReviewServices.getAllProductReviews.mockResolvedValue({ count: 0, results: [] } as any);
    mockedCatalogServices.getBrandById.mockImplementation((id: number | string) => {
      const brandsById: Record<string, { name: string }> = {
        "2": { name: "Lucky Duck Games" },
        "5": { name: "Asmodee" },
      };

      return Promise.resolve(brandsById[String(id)] ?? { name: `Brand ${id}` }) as any;
    });
    mockUseAddToCart.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  test("renders product detail content and product-detail sections for a valid product", async () => {
    const page = await ProductDetailPage({
      params: Promise.resolve({ id: "7" }),
    });

    renderWithQueryClient(page);

    await waitFor(() => {
      expect(screen.getAllByRole("heading", { name: /catan/i }).length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId("product-detail-mobile-header")).toBeInTheDocument();
    expect(screen.getByTestId("product-detail-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("product-detail-footer")).toBeInTheDocument();
    expect(screen.getByTestId("product-detail-mobile-footer")).toBeInTheDocument();

    expect(screen.getAllByText("SKU: 000007").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$50.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("In stock").length).toBeGreaterThan(0);
    const stockProgress = screen.getByTestId("stock-progress").lastElementChild as HTMLElement;
    expect(stockProgress).toHaveStyle({ width: "100%" });
    expect(screen.getAllByRole("button", { name: /add to cart/i }).length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(screen.getAllByText("Asmodee").length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("Backend short summary for Catan.").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Backend full description for Catan.").length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: /game information/i })[0]);
    const publisherLinks = screen.getAllByRole("link", { name: "Lucky Duck Games" });
    expect(publisherLinks.length).toBeGreaterThan(0);
    expect(publisherLinks[0]).toHaveAttribute("href", "/catalog?brand=Lucky+Duck+Games");
    expect(screen.getAllByText("3-4").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10+").length).toBeGreaterThan(0);
    expect(screen.getAllByText("45 minutes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Backend component list").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Backend feature list").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Backend delivery and payment details.").length).toBeGreaterThan(0);
    expect(screen.queryByText("2-5")).not.toBeInTheDocument();
    expect(screen.queryByText(/Nova Poshta/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/description/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/game information/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/delivery and payment/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Reviews summary for 7")).toBeInTheDocument();
    expect(screen.getByText("Reviews comments for 7")).toBeInTheDocument();

    expect(mockedProductServices.getProductById).toHaveBeenCalledWith(
      "7",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(mockedCatalogServices.getBrandById).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(mockedCatalogServices.getBrandById).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  test("adds selected quantity to cart from the product detail controls", async () => {
    const page = await ProductDetailPage({
      params: Promise.resolve({ id: "7" }),
    });

    renderWithQueryClient(page);

    await waitFor(() => {
      expect(screen.getAllByRole("heading", { name: /catan/i }).length).toBeGreaterThan(0);
    });

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: /add to cart/i })[0]);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        productId: 7,
        quantity: 2,
        productData: product,
      });
    });
  });

  test("redirects legacy catalog product URLs to the canonical product route", async () => {
    await LegacyProductDetailPage({
      params: Promise.resolve({ id: "catan special" }),
    });

    expect(mockRedirect).toHaveBeenCalledWith("/product/catan%20special");
  });
});

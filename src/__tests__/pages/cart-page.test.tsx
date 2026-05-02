import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CartPage from "../../app/(cart)/cart/page";

const mockPush = jest.fn();
const mockUseCartQuery = jest.fn();
const mockUpdateCartItem = jest.fn();
const mockRemoveCartItem = jest.fn();
const mockGetRandomProducts = jest.fn();
const mockIsAuthenticated = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/lib/tokenManager", () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

jest.mock("../../hooks/useCartQuery", () => ({
  useCartQuery: () => mockUseCartQuery(),
  useUpdateCartQuantity: () => ({
    mutateAsync: mockUpdateCartItem,
  }),
  useRemoveFromCart: () => ({
    mutateAsync: mockRemoveCartItem,
  }),
}));

jest.mock("../../services/cartServices", () => ({
  productServices: {
    getRandomProducts: (...args: unknown[]) => mockGetRandomProducts(...args),
  },
}));

jest.mock("../../components/shared/CustomBreadcrumb", () => ({
  CustomBreadcrumb: ({ items }: { items: Array<{ label: string }> }) => (
    <nav data-testid="cart-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

jest.mock("../../components/cart/CartItem", () => ({
  __esModule: true,
  default: ({ item, updateQuantity, removeItem }: any) => (
    <article data-testid="cart-item">
      <span>{item.product.name}</span>
      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
        Increase {item.product.name}
      </button>
      <button type="button" onClick={() => removeItem(item.id)}>
        Remove {item.product.name}
      </button>
    </article>
  ),
}));

jest.mock("../../components/cart/CartProductCard", () => ({
  __esModule: true,
  default: ({ product }: any) => <article data-testid="recommended-product">{product.name}</article>,
}));

jest.mock("../../components/catalog/ProductCardSkeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="recommendation-skeleton" />,
}));

jest.mock("@/components/cart/CheckoutModal", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (open ? <div role="dialog">Sign in to checkout</div> : null),
}));

const cartItem = {
  id: "cart-item-7",
  quantity: 2,
  product: {
    id: 7,
    name: "Catan",
    price: "50.00",
    stock: "12",
    images: [{ url_sm: "/catan.jpg" }],
    brand: { name: "Kosmos" },
  },
};

describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUpdateCartItem.mockResolvedValue(undefined);
    mockRemoveCartItem.mockResolvedValue(undefined);
    mockGetRandomProducts.mockResolvedValue([]);
    mockIsAuthenticated.mockReturnValue(false);
  });

  test("renders the loading state while cart data is loading", () => {
    mockUseCartQuery.mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(<CartPage />);

    expect(screen.getByText("Loading cart...")).toBeInTheDocument();
  });

  test("renders the empty cart state and recommendation section", async () => {
    mockGetRandomProducts.mockResolvedValue([
      { id: 1, name: "UNO Flip" },
      { id: 2, name: "Catan: Seafarers" },
    ]);

    render(<CartPage />);

    expect(screen.getByRole("heading", { name: /your cart \(0\)/i })).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping").closest("a")).toHaveAttribute("href", "/catalog");
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Start Shopping").closest("a")).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("heading", { name: /you may also like/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("UNO Flip")).toBeInTheDocument();
      expect(screen.getByText("Catan: Seafarers")).toBeInTheDocument();
    });

    expect(mockGetRandomProducts).toHaveBeenCalledWith(5);
  });

  test("renders cart items, subtotal, and free shipping state when cart has products", () => {
    mockUseCartQuery.mockReturnValue({
      data: [cartItem],
      isLoading: false,
    });

    render(<CartPage />);

    expect(screen.getByRole("heading", { name: /your cart \(1\)/i })).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByTestId("cart-item")).toHaveTextContent("Catan");
    expect(screen.getAllByText("$100.00").length).toBeGreaterThan(0);
    expect(screen.getByText(/free shipping/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /checkout/i })).toBeInTheDocument();
  });

  test("sends authenticated users to checkout from the cart page", () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUseCartQuery.mockReturnValue({
      data: [cartItem],
      isLoading: false,
    });

    render(<CartPage />);

    fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

    expect(mockPush).toHaveBeenCalledWith("/checkout-order");
  });

  test("opens the checkout modal for guest users", () => {
    mockIsAuthenticated.mockReturnValue(false);
    mockUseCartQuery.mockReturnValue({
      data: [cartItem],
      isLoading: false,
    });

    render(<CartPage />);

    fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveTextContent("Sign in to checkout");
  });
});

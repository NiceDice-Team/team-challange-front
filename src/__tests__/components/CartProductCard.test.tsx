import { render, screen } from "@testing-library/react";
import CartProductCard from "@/components/cart/CartProductCard";
import type { Product } from "@/types/product";

const mockMutateAsync = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, fill, ...props }: any) => (
    <img alt={alt} src={typeof src === "string" ? src : ""} {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
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
  HeartFilledIcon: () => <span data-testid="filled-heart" />,
  HeartEmptyIcon: () => <span data-testid="empty-heart" />,
}));

jest.mock("@/hooks/useCartQuery", () => ({
  useAddToCart: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const product: Product = {
  id: 34,
  name: "Ticket to Ride: Legacy",
  price: "15.00",
  stock: -1,
  stars: "4.00",
  images: [],
  reviews: [],
};

describe("CartProductCard", () => {
  test("renders coming soon status and disables purchase for stock -1", () => {
    render(<CartProductCard product={product} />);

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByText(/in stock/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/very low stock/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "COMING SOON" })).toBeDisabled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });
});

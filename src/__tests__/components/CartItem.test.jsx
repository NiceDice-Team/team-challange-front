import { render, screen } from "@testing-library/react";
import CartItem from "@/components/cart/CartItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }) => <img alt={alt} {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock("@/svgs/icons", () => ({
  MinusIcon: () => <svg />,
  PlusIcon: () => <svg />,
  CloseIcon: () => <svg />,
}));

describe("CartItem", () => {
  const baseItem = {
    id: "cart-item-1",
    quantity: 2,
    product: {
      id: 10,
      name: "Catan",
      price: "49.99",
      stock: "2",
      images: [{ url_sm: "/catan.jpg" }],
      brand: { name: "Kosmos" },
    },
  };

  test("disables quantity increase when cart quantity matches stock", () => {
    render(
      <CartItem
        item={baseItem}
        index={0}
        updateQuantity={jest.fn()}
        removeItem={jest.fn()}
      />
    );

    const increaseButtons = screen.getAllByRole("button", {
      name: /Increase quantity of Catan/i,
    });

    increaseButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("keeps quantity increase enabled when stock is still available", () => {
    render(
      <CartItem
        item={{
          ...baseItem,
          quantity: 1,
          product: { ...baseItem.product, stock: "3" },
        }}
        index={0}
        updateQuantity={jest.fn()}
        removeItem={jest.fn()}
      />
    );

    const increaseButtons = screen.getAllByRole("button", {
      name: /Increase quantity of Catan/i,
    });

    increaseButtons.forEach((button) => {
      expect(button).toBeEnabled();
    });
  });
});

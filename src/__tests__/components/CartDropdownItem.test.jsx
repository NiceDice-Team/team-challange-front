import { render, screen } from "@testing-library/react";
import CartDropdownItem from "@/components/cart/CartDropdownItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }) => <img alt={alt} {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock("@/svgs/icons", () => ({
  TrashIcon: () => <svg />,
}));

describe("CartDropdownItem", () => {
  const baseItem = {
    id: "cart-item-1",
    quantity: 2,
    product: {
      id: 10,
      name: "Catan",
      price: "49.99",
      stock: "2",
      images: [{ url_sm: "/catan.jpg" }],
    },
  };

  test("disables quantity increase when current quantity matches stock", () => {
    render(
      <CartDropdownItem
        item={baseItem}
        updateQuantity={jest.fn()}
        removeItem={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /Increase quantity of Catan/i })
    ).toBeDisabled();
  });

  test("keeps quantity increase enabled when stock is still available", () => {
    render(
      <CartDropdownItem
        item={{
          ...baseItem,
          quantity: 1,
          product: { ...baseItem.product, stock: "3" },
        }}
        updateQuantity={jest.fn()}
        removeItem={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /Increase quantity of Catan/i })
    ).toBeEnabled();
  });
});

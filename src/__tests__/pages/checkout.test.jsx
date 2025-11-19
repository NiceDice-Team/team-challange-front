import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "../../app/checkout-order/page";

jest.mock("../../components/shared/CustomBreadcrumb", () => ({
  CustomBreadcrumb: ({ items }) => (
    <nav data-testid="custom-breadcrumb">
      {items.map((item, index) => (
        <span key={index} data-testid={`breadcrumb-item-${index}`}>
          {item.label}
        </span>
      ))}
    </nav>
  ),
}));

jest.mock("../../components/checkout/ShippingForm", () => ({
  __esModule: true,
  default: ({ paymentMethod }) => (
    <div data-testid="shipping-form">
      <span data-testid="shipping-form-payment-method">
        {paymentMethod ? paymentMethod.name : "null"}
      </span>
    </div>
  ),
}));

jest.mock("../../components/checkout/ProductsTable", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ setSubtotal }) => {
      React.useEffect(() => {
        if (setSubtotal) {
          setSubtotal(100);
        }
      }, [setSubtotal]);
      return <div data-testid="products-table">Products Table</div>;
    },
  };
});

jest.mock("../../components/checkout/DeliveryOptions", () => ({
  __esModule: true,
  default: ({ onPaymentMethodChange }) => {
    const mockOption = { id: 1, name: "DHL", price: 35, description: "1-3 days" };
    return (
      <div data-testid="delivery-options">
        <button
          data-testid="select-delivery-option"
          onClick={() => onPaymentMethodChange(mockOption)}
        >
          Select DHL
        </button>
      </div>
    );
  },
}));

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders page with checkout title", () => {
      render(<CheckoutPage />);

      const checkoutTitles = screen.getAllByText("Checkout");
      expect(checkoutTitles.length).toBeGreaterThan(0);
      const title = screen.getByRole("heading", { name: /Checkout/i });
      expect(title).toBeInTheDocument();
    });
    test("renders CustomBreadcrumb component", () => {
      render(<CheckoutPage />);

      expect(screen.getByTestId("custom-breadcrumb")).toBeInTheDocument();
    });
    test("renders breadcrumb items correctly", () => {
      render(<CheckoutPage />);

      expect(screen.getByTestId("breadcrumb-item-0")).toHaveTextContent("Home");
      expect(screen.getByTestId("breadcrumb-item-1")).toHaveTextContent("Board games");
      expect(screen.getByTestId("breadcrumb-item-2")).toHaveTextContent("Cart");
      expect(screen.getByTestId("breadcrumb-item-3")).toHaveTextContent("Checkout");
    });
    test("renders ShippingForm component", () => {
      render(<CheckoutPage />);

      expect(screen.getByTestId("shipping-form")).toBeInTheDocument();
    });
    test("renders ProductsTable component", () => {
      render(<CheckoutPage />);

      expect(screen.getByTestId("products-table")).toBeInTheDocument();
    });
    test("renders DeliveryOptions component", () => {
      render(<CheckoutPage />);

      expect(screen.getByTestId("delivery-options")).toBeInTheDocument();
    });
    test("renders Order Total section", () => {
      render(<CheckoutPage />);

      expect(screen.getByText("Order Total")).toBeInTheDocument();
    });
  })

});

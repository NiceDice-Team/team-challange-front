import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderReviewPage from "@/app/checkout-order/order-review/page";

const mockPush = jest.fn();
const mockSetPaymentCard = jest.fn();
const mockCancelQueries = jest.fn();
const mockSetQueryData = jest.fn();
const mockShowCustomToast = jest.fn();
const mockGetPaymentMethods = jest.fn();
const mockCreateOrder = jest.fn();
const mockClearCartItems = jest.fn();
const mockClearLocalCartItems = jest.fn();

const mockUseCartQuery = jest.fn();
const mockUseCheckoutFormData = jest.fn();
const mockUsePaymentMethod = jest.fn();
const mockUsePaymentCard = jest.fn();
const mockUseCheckoutActions = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: () => ({
    cancelQueries: mockCancelQueries,
    setQueryData: mockSetQueryData,
  }),
}));

jest.mock("@/hooks/useCartQuery", () => ({
  useCartQuery: (...args: unknown[]) => mockUseCartQuery(...args),
}));

jest.mock("@/store/checkout", () => ({
  useCheckoutFormData: (...args: unknown[]) => mockUseCheckoutFormData(...args),
  usePaymentMethod: (...args: unknown[]) => mockUsePaymentMethod(...args),
  usePaymentCard: (...args: unknown[]) => mockUsePaymentCard(...args),
  useCheckoutActions: (...args: unknown[]) => mockUseCheckoutActions(...args),
}));

jest.mock("@/services/orderServices", () => ({
  orderServices: {
    getPaymentMethods: mockGetPaymentMethods,
    createOrder: mockCreateOrder,
  },
}));

jest.mock("@/services/cartServices", () => ({
  cartServices: {
    clearCartItems: mockClearCartItems,
    clearLocalCartItems: mockClearLocalCartItems,
  },
}));

jest.mock("@/components/shared/Toast", () => ({
  showCustomToast: mockShowCustomToast,
}));

jest.mock("@/components/shared/CustomBreadcrumb", () => ({
  CustomBreadcrumb: ({ items }: { items: Array<{ label: string; current?: boolean }> }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>{item.label}</span>
      ))}
    </nav>
  ),
}));

jest.mock("@/components/shared/CustomRadio", () => ({
  RadioButton: ({
    children,
    checked,
    ...props
  }: {
    children: React.ReactNode;
    checked?: boolean;
    [key: string]: unknown;
  }) => (
    <label>
      <input type="radio" checked={checked} {...props} />
      {children}
    </label>
  ),
}));

jest.mock("@/components/checkout/PaymentWrapper", () => {
  const React = require("react");

  return React.forwardRef(function PaymentWrapper(
    props: {
      onValidityChange?: (isValid: boolean) => void;
      onDataChange?: (data: { firstName: string; lastName: string }) => void;
      initialData?: { firstName?: string; lastName?: string };
    },
    ref,
  ) {
    React.useImperativeHandle(ref, () => ({
      validate: async () => true,
    }));

    React.useEffect(() => {
      props.onValidityChange?.(true);
    }, [props.onValidityChange]);

    return <div data-testid="payment-wrapper">Payment wrapper</div>;
  });
});

describe("OrderReviewPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => undefined);

    mockUseCheckoutFormData.mockReturnValue({
      shippingFirstName: "John",
      shippingLastName: "Doe",
      shippingAddress: "Main Street",
      shippingApartment: "12A",
      shippingCity: "Kyiv",
      shippingZipCode: "01001",
      shippingCountry: "Ukraine",
      shippingEmail: "john@example.com",
      shippingPhone: "+380000000000",
      billingFirstName: "John",
      billingLastName: "Doe",
      billingAddress: "Main Street",
      billingApartment: "12A",
      billingCity: "Kyiv",
      billingZipCode: "01001",
      billingCountry: "Ukraine",
      billingEmail: "john@example.com",
      billingPhone: "+380000000000",
    });

    mockUsePaymentMethod.mockReturnValue({
      id: 1,
      name: "Express delivery",
      price: 15,
      description: "Delivery in 2 days",
    });

    mockUsePaymentCard.mockReturnValue({
      firstName: "John",
      lastName: "Doe",
      cardNumber: "4242424242424242",
      expiryDate: "12/30",
      cvv: "123",
    });

    mockUseCheckoutActions.mockReturnValue({
      setPaymentCard: mockSetPaymentCard,
    });

    mockUseCartQuery.mockReturnValue({
      data: [
        {
          id: 1,
          product: { id: 1, name: "Catan", price: 25 },
          quantity: 2,
        },
      ],
      isLoading: false,
    });

    mockGetPaymentMethods.mockResolvedValue([
      { id: 1, name: "Credit card", description: "Pay by bank card" },
      { id: 2, name: "Cash on delivery", description: "Pay in cash" },
    ]);

    mockCreateOrder.mockResolvedValue({});
    mockClearCartItems.mockResolvedValue({});
    mockClearLocalCartItems.mockImplementation(() => undefined);

    const { useQuery } = jest.requireMock("@tanstack/react-query");
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey && queryKey[0] === "payment-methods") {
        return {
          data: [
            { id: 1, name: "Credit card", description: "Pay by bank card" },
            { id: 2, name: "Cash on delivery", description: "Pay in cash" },
          ],
          isLoading: false,
          error: null,
        };
      }

      return {
        data: [],
        isLoading: false,
        error: null,
      };
    });
  });

  it("renders the order review page with shipping, billing and total summary", () => {
    render(<OrderReviewPage />);

    expect(screen.getByRole("heading", { name: "Order review" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shipping" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Billing address" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Payment" })).toBeInTheDocument();
    expect(screen.getAllByText("John Doe")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Your order" })).toBeInTheDocument();
    expect(screen.getByText("Order Total", { selector: "div" })).toBeInTheDocument();
    expect(screen.getByText("$65.00")).toBeInTheDocument();
  });

  it("stores payment data when Place order is clicked", async () => {
    const user = userEvent.setup();

    render(<OrderReviewPage />);

    const submitButton = screen.getByRole("button", { name: /place order/i });
    await user.click(submitButton);

    expect(mockSetPaymentCard).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      cardNumber: "4242424242424242",
      expiryDate: "12/30",
      cvv: "123",
    });
  });
});

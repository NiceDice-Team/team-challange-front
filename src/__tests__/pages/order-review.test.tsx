import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush = jest.fn();
const mockSetPaymentCard = jest.fn();
const mockCreateOrder = jest.fn();
const mockClearCartItems = jest.fn();
const mockClearLocalCartItems = jest.fn();
const mockGetPaymentMethods = jest.fn();
const mockShowCustomToast = jest.fn();
const mockCancelQueries = jest.fn();
const mockSetQueryData = jest.fn();
const mockValidate = jest.fn();

// next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Checkout store
let mockCheckoutUserData = {
  shippingFirstName: "John",
  shippingLastName: "Doe",
  shippingAddress: "123 Main St",
  shippingApartment: "Apt 4",
  shippingCity: "New York",
  shippingZipCode: "10001",
  shippingCountry: "USA",
  shippingEmail: "john@example.com",
  shippingPhone: "+1234567890",
  billingFirstName: "Jane",
  billingLastName: "Doe",
  billingAddress: "456 Elm St",
  billingApartment: "",
  billingCity: "Los Angeles",
  billingZipCode: "90001",
  billingCountry: "USA",
  billingEmail: "jane@example.com",
  billingPhone: "+0987654321",
  copyBilling: false,
};

let mockDeliveryMethod: {
  id: number;
  name: string;
  price: number;
  description: string;
} | null = {
  id: 2,
  name: "Express",
  price: 15.0,
  description: "2-3 business days",
};

let mockSavedPaymentCard: {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
} | null = {
  firstName: "John",
  lastName: "Doe",
  cardNumber: "**** **** **** 4488",
  expiryDate: "12/26",
  cvv: "***",
};

jest.mock("@/store/checkout", () => ({
  useCheckoutFormData: () => mockCheckoutUserData,
  usePaymentMethod: () => mockDeliveryMethod,
  usePaymentCard: () => mockSavedPaymentCard,
  useCheckoutActions: () => ({ setPaymentCard: mockSetPaymentCard }),
}));

// useCartQuery
const mockCartItems = [
  {
    id: 1,
    quantity: 2,
    product: { name: "Catan", price: "39.99" },
  },
  {
    id: 2,
    quantity: 1,
    product: { name: "Ticket to Ride", price: "49.99" },
  },
];

let mockCartLoading = false;

jest.mock("@/hooks/useCartQuery", () => ({
  useCartQuery: () => ({
    data: mockCartItems,
    isLoading: mockCartLoading,
  }),
}));

// orderServices
jest.mock("@/services/orderServices", () => ({
  orderServices: {
    getPaymentMethods: (...args: unknown[]) => mockGetPaymentMethods(...args),
    createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  },
}));

// cartServices
jest.mock("@/services/cartServices", () => ({
  cartServices: {
    clearCartItems: (...args: unknown[]) => mockClearCartItems(...args),
    clearLocalCartItems: (...args: unknown[]) => mockClearLocalCartItems(...args),
  },
}));

// Toast
jest.mock("@/components/shared/Toast", () => ({
  showCustomToast: (...args: unknown[]) => mockShowCustomToast(...args),
}));

// @tanstack/react-query
const mockQueryClient = {
  cancelQueries: (...args: unknown[]) => mockCancelQueries(...args),
  setQueryData: (...args: unknown[]) => mockSetQueryData(...args),
};

jest.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryFn }: { queryFn: () => unknown }) => {
    return { data: mockGetPaymentMethods(), isLoading: false, error: null };
  },
  useQueryClient: () => mockQueryClient,
}));

// queryKeys
jest.mock("@/lib/queryKeys", () => ({
  queryKeys: {
    checkout: { paymentMethods: ["checkout", "paymentMethods"] },
    cart: ["cart"],
  },
}));

// PaymentWrapper
jest.mock("@/components/checkout/PaymentWrapper", () => {
  const React = require("react");
  const PaymentWrapper = React.forwardRef(
    (
      {
        onValidityChange,
      }: { onValidityChange?: (v: boolean) => void },
      ref: React.Ref<{ validate: () => Promise<boolean> }>
    ) => {
      React.useImperativeHandle(ref, () => ({
        validate: () => mockValidate(),
      }));
      return (
        <div data-testid="payment-wrapper">
          <button
            data-testid="set-payment-valid"
            onClick={() => onValidityChange?.(true)}
          >
            Set Valid
          </button>
          <button
            data-testid="set-payment-invalid"
            onClick={() => onValidityChange?.(false)}
          >
            Set Invalid
          </button>
        </div>
      );
    }
  );
  PaymentWrapper.displayName = "PaymentWrapper";
  return { __esModule: true, default: PaymentWrapper };
});

// CustomBreadcrumb
jest.mock("@/components/shared/CustomBreadcrumb", () => ({
  CustomBreadcrumb: ({ items }: { items: Array<{ label: string }> }) => (
    <nav data-testid="breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

// CustomButton
jest.mock("@/components/shared/CustomButton", () => ({
  CustomButton: ({
    children,
    onClick,
    disabled,
    loading,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }) => (
    <button
      data-testid="custom-button"
      onClick={onClick}
      disabled={disabled || loading}
      data-loading={loading ? "true" : "false"}
      className={className}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  ),
}));

// CustomInput
jest.mock("@/components/shared/CustomInput", () => ({
  CustomInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

// CustomRadio
jest.mock("@/components/shared/CustomRadio", () => ({
  RadioButton: ({
    children,
    id,
    checked,
    onChange,
  }: {
    children: React.ReactNode;
    id: string;
    checked: boolean;
    onChange?: () => void;
  }) => (
    <div
      data-testid={`radio-${id}`}
      data-checked={checked ? "true" : "false"}
      onClick={onChange}
      role="radio"
      aria-checked={checked}
    >
      {children}
    </div>
  ),
}));

// SVG icons
jest.mock("@/svgs/icons", () => ({
  CreditCardIcon: () => <span data-testid="credit-card-icon" />,
  ChevronDownIcon: ({ isExpanded }: { isExpanded: boolean }) => (
    <span data-testid="chevron-icon" data-expanded={isExpanded ? "true" : "false"} />
  ),
}));

// lucide-react
jest.mock("lucide-react", () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
}));

// ---------------------------------------------------------------------------
// Import page AFTER all mocks
// ---------------------------------------------------------------------------
import OrderReviewPage from "../../app/checkout-order/order-review/page";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const mockPaymentMethods = [
  { id: 1, name: "Credit Card", description: "Pay with card" },
  { id: 2, name: "PayPal", description: "Pay via PayPal" },
];

function setup() {
  mockGetPaymentMethods.mockReturnValue(mockPaymentMethods);
  mockCreateOrder.mockResolvedValue({ id: 99 });
  mockClearCartItems.mockResolvedValue(undefined);
  mockValidate.mockResolvedValue(true);
  jest.useFakeTimers();
  return render(<OrderReviewPage />);
}

afterEach(() => {
  jest.clearAllMocks();
  jest.runAllTimers();
  jest.useRealTimers();
});

// ===========================================================================
// 1. Shipping Address
// ===========================================================================
describe("1. Shipping Address", () => {
  test("displays all shipping data entered at checkout", () => {
    setup();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
    expect(screen.getByText(/Apt 4/)).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByText(/10001/)).toBeInTheDocument();
    // USA appears in both shipping & billing sections – check it's present at all
    expect(screen.getAllByText(/USA/).length).toBeGreaterThan(0);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
  });

  test("Edit (Shipping section) navigates back to /checkout-order", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    // First Edit button belongs to Shipping section
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);
    expect(mockPush).toHaveBeenCalledWith("/checkout-order");
  });

  test("shipping data renders correctly (name and address together)", () => {
    setup();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St, Apt 4/)).toBeInTheDocument();
  });
});

// ===========================================================================
// 2. Billing Address
// ===========================================================================
describe("2. Billing Address", () => {
  test("displays all billing data", () => {
    setup();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/456 Elm St/)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles/)).toBeInTheDocument();
    expect(screen.getByText(/90001/)).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("+0987654321")).toBeInTheDocument();
  });

  test("Edit (Billing section) navigates back to /checkout-order", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    // Second Edit button belongs to Billing section
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[1]);
    expect(mockPush).toHaveBeenCalledWith("/checkout-order");
  });

  test("when billing=shipping (copyBilling active), billing shows same data as shipping", () => {
    const saved = mockCheckoutUserData;
    mockCheckoutUserData = {
      ...saved,
      copyBilling: true,
      billingFirstName: "John",
      billingLastName: "Doe",
      billingAddress: "123 Main St",
      billingApartment: "Apt 4",
      billingCity: "New York",
      billingZipCode: "10001",
      billingCountry: "USA",
      billingEmail: "john@example.com",
      billingPhone: "+1234567890",
    };
    setup();
    // Both shipping and billing sections should show "John Doe"
    const johnDoeOccurrences = screen.getAllByText(/John Doe/);
    expect(johnDoeOccurrences.length).toBeGreaterThanOrEqual(2);
    mockCheckoutUserData = saved;
  });
});

// ===========================================================================
// 3. Delivery
// ===========================================================================
describe("3. Delivery", () => {
  test("displays selected delivery method name", () => {
    setup();
    // The component renders the name with a `font-medium uppercase` CSS class;
    // the DOM text content is "Express" (CSS uppercases it visually).
    expect(screen.getByText("Express")).toBeInTheDocument();
  });

  test("displays correct shipping cost", () => {
    setup();
    // Shipping cost $15.00 appears in delivery section AND order total
    const shippingCosts = screen.getAllByText("$15.00");
    expect(shippingCosts.length).toBeGreaterThan(0);
  });

  test("displays delivery description / timeframe", () => {
    setup();
    expect(screen.getByText("2-3 business days")).toBeInTheDocument();
  });

  test("Edit (Delivery section) navigates back to /checkout-order", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    // Delivery Edit button is inside the right column
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    // There are 3 Edit buttons: Shipping, Billing, Delivery
    const deliveryEditButton = editButtons[2];
    await user.click(deliveryEditButton);
    expect(mockPush).toHaveBeenCalledWith("/checkout-order");
  });

  test("shows 'No delivery method selected' when none is set", () => {
    const saved = mockDeliveryMethod;
    mockDeliveryMethod = null;
    setup();
    expect(screen.getByText("No delivery method selected")).toBeInTheDocument();
    mockDeliveryMethod = saved;
  });
});

// ===========================================================================
// 4. Payment
// ===========================================================================
describe("4. Payment", () => {
  test("renders payment method options", () => {
    setup();
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    expect(screen.getByText("PayPal")).toBeInTheDocument();
  });

  test("credit card option is checked by default (id=1)", () => {
    setup();
    const creditCardRadio = screen.getByTestId("radio-payment-method-1");
    expect(creditCardRadio).toHaveAttribute("data-checked", "true");
  });

  test("PaymentWrapper is shown when credit card is selected", () => {
    setup();
    expect(screen.getByTestId("payment-wrapper")).toBeInTheDocument();
  });

  test("payment section toggle collapses and re-expands payment options", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    const toggleBtn = screen.getByRole("button", { name: /toggle payment/i });
    // Initially expanded – credit card shown
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    await user.click(toggleBtn);
    expect(screen.queryByText("Credit Card")).not.toBeInTheDocument();
    await user.click(toggleBtn);
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
  });

  test("selecting a different payment method updates the display (no card form)", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    // PaymentWrapper is rendered initially because credit card (id=1) is selected.
    expect(screen.getByTestId("payment-wrapper")).toBeInTheDocument();
    // Click on PayPal radio to select it (our mock calls onChange on click)
    const paypalRadio = screen.getByTestId("radio-payment-method-2");
    await user.click(paypalRadio);
    await waitFor(() => {
      // PaymentWrapper should no longer appear after selecting non-card payment
      expect(screen.queryByTestId("payment-wrapper")).not.toBeInTheDocument();
    });
  });
});

// ===========================================================================
// 5. Order Summary
// ===========================================================================
describe("5. Order Summary", () => {
  test("displays item names", () => {
    setup();
    expect(screen.getByText("Catan")).toBeInTheDocument();
    expect(screen.getByText("Ticket to Ride")).toBeInTheDocument();
  });

  test("displays item quantities", () => {
    setup();
    expect(screen.getByText("2")).toBeInTheDocument(); // Catan qty
    expect(screen.getByText("1")).toBeInTheDocument(); // Ticket qty
  });

  test("displays per-item totals", () => {
    setup();
    // Catan: 2 × 39.99 = 79.98
    expect(screen.getByText("$79.98")).toBeInTheDocument();
    // Ticket: 1 × 49.99 = 49.99
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  test("subtotal is calculated correctly (sum of item prices × quantities)", () => {
    setup();
    // subtotal = 2*39.99 + 1*49.99 = 79.98 + 49.99 = 129.97
    expect(screen.getByText("$129.97")).toBeInTheDocument();
  });

  test("order total = subtotal + shipping", () => {
    setup();
    // total = 129.97 + 15.00 = 144.97
    expect(screen.getByText("$144.97")).toBeInTheDocument();
  });

  test("displays 'No items in cart' when cart is empty", () => {
    jest.mock("@/hooks/useCartQuery", () => ({
      useCartQuery: () => ({ data: [], isLoading: false }),
    }));
    // Re-render with empty cart using temporary override
    const savedItems = mockCartItems.splice(0);
    mockCartItems.length = 0;
    setup();
    expect(screen.getByText("No items in cart")).toBeInTheDocument();
    // Restore
    mockCartItems.push(...savedItems);
  });
});

// ===========================================================================
// 6. Place Order
// ===========================================================================
describe("6. Place Order", () => {
  test("Place Order button is disabled when card payment and form is invalid", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    // Make form invalid
    fireEvent.click(screen.getByTestId("set-payment-invalid"));
    const placeOrderBtn = screen.getByTestId("custom-button");
    expect(placeOrderBtn).toBeDisabled();
  });

  test("Place Order button is enabled when card payment form is valid", async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const placeOrderBtn = screen.getByTestId("custom-button");
    expect(placeOrderBtn).not.toBeDisabled();
  });

  test("clicking Place Order calls createOrder API", async () => {
    setup();
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByTestId("custom-button"));
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    });
  });

  test("shows loading state (button disabled) during request", async () => {
    // Use real timers for this test
    jest.useRealTimers();
    // Delay createOrder so we can observe the loading state
    let resolveOrder!: (v: unknown) => void;
    mockValidate.mockResolvedValue(true);
    mockCreateOrder.mockImplementation(
      () => new Promise((resolve) => { resolveOrder = resolve; })
    );
    mockGetPaymentMethods.mockReturnValue(mockPaymentMethods);
    mockClearCartItems.mockResolvedValue(undefined);
    render(<OrderReviewPage />);
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const user = userEvent.setup({ delay: null });
    const btn = screen.getByTestId("custom-button");
    user.click(btn); // intentionally not awaited
    await waitFor(() => {
      expect(btn).toBeDisabled();
    }, { timeout: 2000 });
    // Clean up pending promise
    resolveOrder({ id: 1 });
  });

  test("on success, shows success toast and redirects to home", async () => {
    mockCreateOrder.mockResolvedValue({ id: 1 });
    setup();
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByTestId("custom-button"));
    await waitFor(() => {
      expect(mockShowCustomToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" })
      );
    });
    act(() => jest.runAllTimers());
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("on error, shows error toast", async () => {
    setup();
    // Override createOrder to reject AFTER setup() sets the default resolved value
    mockCreateOrder.mockRejectedValue(new Error("Network error"));
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByTestId("custom-button"));
    await waitFor(() => {
      expect(mockShowCustomToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" })
      );
    });
  });

  test("on success, clears cart", async () => {
    mockCreateOrder.mockResolvedValue({ id: 1 });
    setup();
    fireEvent.click(screen.getByTestId("set-payment-valid"));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByTestId("custom-button"));
    await waitFor(() => {
      expect(mockClearCartItems).toHaveBeenCalledTimes(1);
    });
  });
});

// ===========================================================================
// 7. UI / UX
// ===========================================================================
describe("7. UI / UX", () => {
  test("component renders without errors", () => {
    expect(() => setup()).not.toThrow();
  });

  test("Place Order button has hover-related class (hover:bg-purple/90)", () => {
    setup();
    const btn = screen.getByTestId("custom-button");
    expect(btn.className).toContain("hover:bg-purple");
  });

  test("breadcrumb is rendered with Order review as last item", () => {
    setup();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    // "Order review" appears in breadcrumb and as h1 – at least one occurrence
    const orderReviewItems = screen.getAllByText("Order review");
    expect(orderReviewItems.length).toBeGreaterThan(0);
  });

  test("renders 'Order review' page title", () => {
    setup();
    expect(screen.getByRole("heading", { name: /order review/i })).toBeInTheDocument();
  });

  test("'Return to checkout' link points to /checkout-order", () => {
    setup();
    const link = screen.getByRole("link", { name: /return to checkout/i });
    expect(link).toHaveAttribute("href", "/checkout-order");
  });

  test("'Your order' section heading is visible", () => {
    setup();
    expect(screen.getByRole("heading", { name: /your order/i })).toBeInTheDocument();
  });
});

// ===========================================================================
// 8. Quality Gate
// ===========================================================================
describe("8. Quality Gate", () => {
  test("all required sections render: Shipping, Billing address, Payment, Delivery, Order review", () => {
    setup();
    // "Shipping" appears multiple times (section heading + order total row)
    expect(screen.getAllByText("Shipping").length).toBeGreaterThan(0);
    expect(screen.getByText("Billing address")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /order review/i })).toBeInTheDocument();
  });

  test("order total math is always exact: Order Total = Subtotal + Shipping", () => {
    setup();
    // subtotal = 2*39.99 + 1*49.99 = 129.97
    // shipping = 15.00
    // total = 144.97
    const subtotal = 2 * 39.99 + 1 * 49.99;
    const shipping = 15.0;
    const expectedTotal = +(subtotal + shipping).toFixed(2);
    expect(expectedTotal).toBe(144.97);
    expect(screen.getByText(`$${expectedTotal.toFixed(2)}`)).toBeInTheDocument();
  });

  test("no console errors during render (quality gate: clean render)", () => {
    setup();
    // jest.setup.ts replaces console.error with jest.fn() — ensure no errors were logged
    expect(console.error).not.toHaveBeenCalled();
  });

  test("Place Order button is present and accessible", () => {
    setup();
    const btn = screen.getByTestId("custom-button");
    expect(btn).toBeInTheDocument();
  });
});

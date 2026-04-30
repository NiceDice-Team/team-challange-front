import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeliveryOptions from "../../components/checkout/DeliveryOptions";
import { orderServices } from "@/services/orderServices";
import { useCheckoutStore } from "@/store/checkout";
import type { DeliveryOption } from "@/store/checkout";

jest.mock("react-i18next", () => {
  const path = require("path");
  const fs = require("fs");
  function lookupTranslation(key: string) {
    const commonPath = path.resolve(process.cwd(), "public/locales/en/common.json");
    const common = JSON.parse(fs.readFileSync(commonPath, "utf8"));
    const parts = key.split(".");
    let cur: unknown = common;
    for (const p of parts) {
      cur = cur && typeof cur === "object" ? (cur as Record<string, unknown>)[p] : undefined;
    }
    return typeof cur === "string" ? cur : key;
  }
  return {
    useTranslation: () => ({
      t: (key: string) => lookupTranslation(key),
    }),
  };
});

jest.mock("@/services/orderServices", () => ({
  orderServices: {
    getDeliveryOptions: jest.fn(),
  },
}));

jest.mock("../../components/shared/CustomRadio", () => ({
  RadioButton: ({
    children,
    checked,
    onChange,
    value,
    id,
    name,
    className,
  }) => (
    <label className={className} onClick={onChange} data-testid={`radio-${id}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        data-testid={`radio-input-${id}`}
      />
      {children}
    </label>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="info-icon" />
  ),
}));

jest.mock("../../assets/icons/attention.svg", () => "attention-icon.svg");

const mockOnPaymentMethodChange = jest.fn();
const mockGetDeliveryOptions =
  orderServices.getDeliveryOptions as unknown as jest.Mock;

const mockDeliveryOptions: DeliveryOption[] = [
  {
    id: 1,
    name: "DHL",
    price: 35,
    description: "1-3 business days (3 days)",
  },
  {
    id: 2,
    name: "Nova poshta",
    price: 20,
    description: "3-5 business days (4 days)",
  },
];

const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("DeliveryOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCheckoutStore.getState().resetCheckout();
    mockGetDeliveryOptions.mockResolvedValue(mockDeliveryOptions);
  });

  test("renders delivery options from the API", async () => {
    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    expect(screen.getByText("Choose delivery option")).toBeInTheDocument();
    expect(await screen.findByText("DHL")).toBeInTheDocument();
    expect(await screen.findByText("Nova poshta")).toBeInTheDocument();
    expect(screen.getAllByText("$35").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$20").length).toBeGreaterThan(0);
  });

  test("selects the first delivery option by default", async () => {
    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    const firstRadio = await screen.findByTestId("radio-input-1");
    expect(firstRadio).toBeChecked();

    await waitFor(() => {
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(mockDeliveryOptions[0]);
    });
  });

  test("uses the stored delivery option when it is still valid", async () => {
    useCheckoutStore.setState({
      paymentMethod: mockDeliveryOptions[1],
    });

    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    const secondRadio = await screen.findByTestId("radio-input-2");
    expect(secondRadio).toBeChecked();
  });

  test("allows selecting another delivery option", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    const secondRadio = await screen.findByTestId("radio-input-2");
    await user.click(secondRadio);

    await waitFor(() => {
      expect(secondRadio).toBeChecked();
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(mockDeliveryOptions[1]);
    });
  });

  test("renders loading state", () => {
    mockGetDeliveryOptions.mockReturnValue(new Promise(() => {}));

    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state", async () => {
    mockGetDeliveryOptions.mockRejectedValue(new Error("API error"));

    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    expect(await screen.findByText("Failed to load delivery options")).toBeInTheDocument();
  });

  test("renders empty state when the API returns no delivery options", async () => {
    mockGetDeliveryOptions.mockResolvedValue([]);

    renderWithQueryClient(
      <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
    );

    expect(await screen.findByText("No delivery options available")).toBeInTheDocument();
    expect(screen.getByText("Shipping").parentElement).toHaveTextContent("-");
  });
});

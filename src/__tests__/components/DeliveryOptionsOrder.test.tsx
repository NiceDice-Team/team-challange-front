import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeliveryOptions from "../../components/checkout/DeliveryOptions";

const mockSetPaymentMethod = jest.fn();
const mockOnPaymentMethodChange = jest.fn();
const mockUseCheckoutStore = jest.fn();
const mockUseDeliveryOptionsQuery = jest.fn();

const mockDeliveryOptions = [
  {
    id: 1,
    name: "Самовивіз",
    description: "Самостійний вивіз з магазину",
    price: 0,
    estimatedDays: 0,
  },
  {
    id: 2,
    name: "Нова Пошта",
    description: "Доставка Новою Поштою",
    price: 150,
    estimatedDays: 2,
  },
  {
    id: 3,
    name: "Укрпошта",
    description: "Доставка Укрпоштою",
    price: 50,
    estimatedDays: 5,
  },
];

jest.mock("@/store/checkout", () => ({
  useCheckoutStore: (...args) => mockUseCheckoutStore(...args),
}));

jest.mock("@/hooks/useDeliveryOptionsQuery", () => ({
  useDeliveryOptionsQuery: () => mockUseDeliveryOptionsQuery(),
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

describe("DeliveryOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCheckoutStore.mockImplementation((selector) => {
      const state = {
        paymentMethod: null,
        setPaymentMethod: mockSetPaymentMethod,
      };

      return selector ? selector(state) : state;
    });

    mockUseDeliveryOptionsQuery.mockReturnValue({
      data: mockDeliveryOptions,
      isLoading: false,
      isError: false,
    });
  });

  test("renders delivery options from the API response", () => {
    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    expect(screen.getByText("Choose delivery option")).toBeInTheDocument();

    mockDeliveryOptions.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
      expect(screen.getByText(option.description)).toBeInTheDocument();
      expect(screen.getAllByText(`$${option.price}`).length).toBeGreaterThan(0);
    });
  });

  test("selects the first API option by default and syncs it to state", async () => {
    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    await waitFor(() => {
      expect(screen.getByTestId("radio-input-1")).toBeChecked();
      expect(mockSetPaymentMethod).toHaveBeenCalledWith(mockDeliveryOptions[0]);
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(mockDeliveryOptions[0]);
    });
  });

  test("allows selecting a different delivery option", async () => {
    const user = userEvent.setup();
    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    const secondRadio = screen.getByTestId("radio-input-2");
    await user.click(secondRadio);

    expect(secondRadio).toBeChecked();
    expect(mockSetPaymentMethod).toHaveBeenLastCalledWith(mockDeliveryOptions[1]);
    expect(mockOnPaymentMethodChange).toHaveBeenLastCalledWith(mockDeliveryOptions[1]);
    expect(screen.getAllByText("$150").length).toBeGreaterThan(0);
  });

  test("uses the saved checkout delivery option when it exists in the fetched list", async () => {
    mockUseCheckoutStore.mockImplementation((selector) => {
      const state = {
        paymentMethod: mockDeliveryOptions[2],
        setPaymentMethod: mockSetPaymentMethod,
      };

      return selector ? selector(state) : state;
    });

    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    await waitFor(() => {
      expect(screen.getByTestId("radio-input-3")).toBeChecked();
      expect(mockSetPaymentMethod).toHaveBeenCalledWith(mockDeliveryOptions[2]);
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(mockDeliveryOptions[2]);
    });
  });

  test("renders loading state while delivery options are being fetched", () => {
    mockUseDeliveryOptionsQuery.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    expect(screen.getByText("Loading delivery options...")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders error state when delivery options request fails", () => {
    mockUseDeliveryOptionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    expect(screen.getByText("Unable to load delivery options.")).toBeInTheDocument();
  });

  test("renders empty state when API returns no delivery options", () => {
    mockUseDeliveryOptionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    expect(screen.getByText("No delivery options available.")).toBeInTheDocument();
  });

  test("renders customs info block when options are available", () => {
    render(<DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />);

    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please note that all international shipments may be subject to customs/i
      )
    ).toBeInTheDocument();
  });
});

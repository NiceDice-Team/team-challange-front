import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeliveryOptions, {
  deliveryOptions,
} from "../../components/checkout/DeliveryOptions";

const mockSetPaymentMethod = jest.fn();
const mockOnPaymentMethodChange = jest.fn();

jest.mock("../../store/checkout", () => ({
  useCheckoutStore: jest.fn(() => ({
    setPaymentMethod: mockSetPaymentMethod,
  })),
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
  });

  describe("Rendering", () => {
    test("renders component with title", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      expect(screen.getByText("Choose delivery option")).toBeInTheDocument();
    });
    test("renders all delivery options", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      deliveryOptions.forEach((option) => {
        expect(screen.getByText(option.name)).toBeInTheDocument();
        const prices = screen.getAllByText(`$${option.price}`);
        expect(prices.length).toBeGreaterThan(0);
        expect(screen.getByText(option.description)).toBeInTheDocument();
      });
    });
    test("renders info message about customs duties", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      expect(
        screen.getByText(
          /Please note that all international shipments may be subject to customs/i
        )
      ).toBeInTheDocument();
    });
    test("renders info icon", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      expect(screen.getByTestId("info-icon")).toBeInTheDocument();
      expect(screen.getByTestId("info-icon")).toHaveAttribute("alt", "info");
    });
    test("renders shipping section with price", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      expect(screen.getByText("Shipping")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${deliveryOptions[0].price}`);
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe("Default selection", () => {
    test("selects first delivery option by default", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const firstRadio = screen.getByTestId(
        `radio-input-${deliveryOptions[0].id}`
      );
      expect(firstRadio).toBeChecked();
    });
    test("displays first option price in shipping section by default", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const shippingPrices = screen.getAllByText(
        `$${deliveryOptions[0].price}`
      );
      expect(shippingPrices.length).toBeGreaterThan(0);
    });
  });

  describe("Option selection", () => {
    test("allows selecting different delivery option", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const secondRadio = screen.getByTestId(
        `radio-input-${deliveryOptions[1].id}`
      );
      await user.click(secondRadio);

      expect(secondRadio).toBeChecked();
    });
    test("updates shipping price when option is selected", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const secondOption = deliveryOptions[1];
      const secondRadio = screen.getByTestId(`radio-input-${secondOption.id}`);
      await user.click(secondRadio);

      const shippingPrices = screen.getAllByText(`$${secondOption.price}`);
      expect(shippingPrices.length).toBeGreaterThan(0);
    });
    
  });
});

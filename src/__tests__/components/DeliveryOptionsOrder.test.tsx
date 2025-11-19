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
    test("calls onPaymentMethodChange when option is selected", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const secondOption = deliveryOptions[1];
      const secondRadio = screen.getByTestId(`radio-input-${secondOption.id}`);
      await user.click(secondRadio);

      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(secondOption);
    });
    test("unchecks previous option when new option is selected", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const firstRadio = screen.getByTestId(
        `radio-input-${deliveryOptions[0].id}`
      );
      const secondRadio = screen.getByTestId(
        `radio-input-${deliveryOptions[1].id}`
      );

      expect(firstRadio).toBeChecked();
      expect(secondRadio).not.toBeChecked();

      await user.click(secondRadio);

      expect(firstRadio).not.toBeChecked();
      expect(secondRadio).toBeChecked();
    });
  });

  describe("All delivery options", () => {
    test("renders DHL option correctly", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const dhlOption = deliveryOptions.find((opt) => opt.name === "DHL");
      expect(screen.getByText("DHL")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${dhlOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(screen.getByText(dhlOption.description)).toBeInTheDocument();
    });
    test("renders Nova poshta option correctly", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const novaOption = deliveryOptions.find(
        (opt) => opt.name === "Nova poshta"
      );
      expect(screen.getByText("Nova poshta")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${novaOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(screen.getByText(novaOption.description)).toBeInTheDocument();
    });
    test("renders Fedex option correctly", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const fedexOption = deliveryOptions.find((opt) => opt.name === "Fedex");
      expect(screen.getByText("Fedex")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${fedexOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(screen.getByText(fedexOption.description)).toBeInTheDocument();
    });
    test("renders Ukrposhta option correctly", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const ukrOption = deliveryOptions.find((opt) => opt.name === "Ukrposhta");
      expect(screen.getByText("Ukrposhta")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${ukrOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(screen.getByText(ukrOption.description)).toBeInTheDocument();
    });
  });

  describe("Price display", () => {
    test("displays correct price for each option", () => {
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      deliveryOptions.forEach((option) => {
        const prices = screen.getAllByText(`$${option.price}`);
        expect(prices.length).toBeGreaterThan(0);
      });
    });
    test("updates shipping price correctly when switching options", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const thirdOption = deliveryOptions[2];
      const thirdRadio = screen.getByTestId(`radio-input-${thirdOption.id}`);
      await user.click(thirdRadio);

      const shippingPrices = screen.getAllByText(`$${thirdOption.price}`);
      expect(shippingPrices.length).toBeGreaterThan(0);
    });
  });

  describe("Multiple selections", () => {
    test("handles multiple option changes correctly", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const secondOption = deliveryOptions[1];
      const thirdOption = deliveryOptions[2];
      const fourthOption = deliveryOptions[3];

      const secondRadio = screen.getByTestId(`radio-input-${secondOption.id}`);
      const thirdRadio = screen.getByTestId(`radio-input-${thirdOption.id}`);
      const fourthRadio = screen.getByTestId(`radio-input-${fourthOption.id}`);

      await user.click(secondRadio);
      expect(secondRadio).toBeChecked();
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(secondOption);

      await user.click(thirdRadio);
      expect(thirdRadio).toBeChecked();
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(thirdOption);

      await user.click(fourthRadio);
      expect(fourthRadio).toBeChecked();
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(fourthOption);
    });
  });

  describe("Edge cases", () => {
    test("handles clicking on already selected option", async () => {
      const user = userEvent.setup();
      render(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />
      );

      const firstRadio = screen.getByTestId(
        `radio-input-${deliveryOptions[0].id}`
      );
      expect(firstRadio).toBeChecked();

      await user.click(firstRadio);

      expect(firstRadio).toBeChecked();
      expect(mockOnPaymentMethodChange).toHaveBeenCalled();
    });
  });
});

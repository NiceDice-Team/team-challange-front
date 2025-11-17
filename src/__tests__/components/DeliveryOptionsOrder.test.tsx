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
            <DeliveryOptions
              onPaymentMethodChange={mockOnPaymentMethodChange}
            />
          );

          deliveryOptions.forEach((option) => {
            expect(screen.getByText(option.name)).toBeInTheDocument();
            const prices = screen.getAllByText(`$${option.price}`);
            expect(prices.length).toBeGreaterThan(0);
            expect(screen.getByText(option.description)).toBeInTheDocument();
          });
        });
  });

});

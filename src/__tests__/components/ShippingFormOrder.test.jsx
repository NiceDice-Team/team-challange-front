import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShippingForm from "../../components/checkout/ShippingForm";

const mockPush = jest.fn();
const mockSetFormData = jest.fn();
const mockSetPaymentMethod = jest.fn();

const mockPaymentMethod = {
  id: 1,
  name: "Standard Shipping",
  price: 10.99,
  description: "Standard shipping option",
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../../store/checkout", () => ({
  useCheckoutStore: jest.fn(() => ({
    setFormData: mockSetFormData,
    setPaymentMethod: mockSetPaymentMethod,
  })),
}));

jest.mock("../../components/shared/CustomInput", () => ({
  CustomInput: ({ label, id, name, placeholder, error, ...props }) => (
    <div data-testid={`input-${name}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        data-testid={name}
        {...props}
      />
      {error && error.length > 0 && (
        <div data-testid={`error-${name}`}>{error[0]}</div>
      )}
    </div>
  ),
}));

jest.mock("../../components/checkout/CountrySelectWithSearch", () => ({
  __esModule: true,
  default: ({ value, onChange, name, error }) => (
    <div data-testid={`country-select-${name}`}>
      <select
        data-testid={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Select country</option>
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
      </select>
      {error && error.length > 0 && (
        <div data-testid={`error-${name}`}>{error[0]}</div>
      )}
    </div>
  ),
}));

jest.mock("../../components/checkout/PhoneNumberInput", () => ({
  __esModule: true,
  default: ({ value, onChange, name, error }) => (
    <div data-testid={`phone-input-${name}`}>
      <input
        data-testid={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Phone number"
      />
      {error && error.length > 0 && (
        <div data-testid={`error-${name}`}>{error[0]}</div>
      )}
    </div>
  ),
}));

jest.mock("../../components/shared/CustomCheckbox", () => ({
  __esModule: true,
  default: ({ label, id, checked, onCheckedChange }) => (
    <div data-testid="custom-checkbox">
      <input
        type="checkbox"
        id={id}
        data-testid={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  ),
}));

jest.mock("../../components/shared/CustomButton", () => ({
  CustomButton: ({ children, type, disabled, onClick, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-testid="submit-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("ShippingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });
  describe("Rendering", () => {
    test("renders form with Shipping title", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.getByText("Shipping")).toBeInTheDocument();
    });

    test("отображает все поля формы доставки", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Apartment, suite, etc")).toBeInTheDocument();
      expect(screen.getByLabelText("Zip Code")).toBeInTheDocument();
      expect(screen.getByLabelText("Town / City")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByTestId("shippingCountry")).toBeInTheDocument();
      expect(screen.getByTestId("shippingPhone")).toBeInTheDocument();
    });
    test("renders checkbox for copying shipping address", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(
        screen.getByLabelText(/Use shipping address as billing address/i)
      ).toBeInTheDocument();
    });
    test("renders submit button", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(
        screen.getByRole("button", { name: /Order review/i })
      ).toBeInTheDocument();
    });

    test("renders link to return to cart", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.getByText("Return to cart")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Return to cart/i })).toHaveAttribute(
        "href",
        "/cart"
      );
    });
  })

});

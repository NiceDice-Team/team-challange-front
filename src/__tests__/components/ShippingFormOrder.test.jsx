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
    test("does not render billing address fields by default (when copyBilling = true)", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.queryByText("Billing adress")).not.toBeInTheDocument();
    });
    test("renders billing address fields when copyBilling is false", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const checkbox = screen.getByTestId("copyBilling");
      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText("Billing adress")).toBeInTheDocument();
      });
    });
  })

  describe("Default values", () => {
    test("fills form fields with default values", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.getByTestId("shippingFirstName")).toHaveValue("John");
      expect(screen.getByTestId("shippingLastName")).toHaveValue("Doe");
      expect(screen.getByTestId("shippingAddress")).toHaveValue("123 Main Street");
      expect(screen.getByTestId("shippingApartment")).toHaveValue("Apt 4B");
      expect(screen.getByTestId("shippingZipCode")).toHaveValue("12345");
      expect(screen.getByTestId("shippingCity")).toHaveValue("New York");
      expect(screen.getByTestId("shippingEmail")).toHaveValue("john.doe@example.com");
      expect(screen.getByTestId("shippingPhone")).toHaveValue("+1234567890");
    });
    test("checkbox copyBilling is checked by default", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      expect(screen.getByTestId("copyBilling")).toBeChecked();
    });
  })

  describe("Copying billing address", () => {
    test("copies shipping data to billing address when copyBilling = true", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const checkbox = screen.getByTestId("copyBilling");
      expect(checkbox).toBeChecked();

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
        const callArgs = mockSetFormData.mock.calls[0][0];
        expect(callArgs.billingFirstName).toBe("John");
        expect(callArgs.billingLastName).toBe("Doe");
        expect(callArgs.billingAddress).toBe("123 Main Street");
      });
    });
    test("hides billing address fields when checkbox is checked", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const checkbox = screen.getByTestId("copyBilling");
      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText("Billing adress")).toBeInTheDocument();
      });

      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.queryByText("Billing adress")).not.toBeInTheDocument();
      });
    });
  })

  describe("Form validation", () => {
    test("shows validation error for empty first name", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const firstNameInput = screen.getByTestId("shippingFirstName");
      await user.clear(firstNameInput);

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });
    test("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const emailInput = screen.getByTestId("shippingEmail");
      await user.clear(emailInput);
      await user.type(emailInput, "invalid-email");

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
      });
    });
    test("shows validation error for short zip code", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const zipCodeInput = screen.getByTestId("shippingZipCode");
      await user.clear(zipCodeInput);
      await user.type(zipCodeInput, "12");

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Zip code must be at least 3 characters/i)
        ).toBeInTheDocument();
      });
    });
    test("shows validation error for short address", async () => {
        const user = userEvent.setup();
        render(<ShippingForm paymentMethod={mockPaymentMethod} />);

        const addressInput = screen.getByTestId("shippingAddress");
        await user.clear(addressInput);
        await user.type(addressInput, "123");

        const submitButton = screen.getByTestId("submit-button");
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Address must be at least 5 characters/i)
          ).toBeInTheDocument();
        });
    });
  })

  describe("Form submission", () => {
    test("submits form with valid data", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
        expect(mockSetPaymentMethod).toHaveBeenCalledWith(mockPaymentMethod);
        expect(mockPush).toHaveBeenCalledWith("/checkout-order/order-review");
      });
    });
    test("does not submit the form if there are validation errors", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const firstNameInput = screen.getByTestId("shippingFirstName");
      await user.clear(firstNameInput);

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });

      expect(mockSetFormData).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
    test("submits form with billing address when copyBilling is false", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const checkbox = screen.getByTestId("copyBilling");
      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText("Billing adress")).toBeInTheDocument();
      });

      const billingCountry = screen.getByTestId("billingCountry");
      const billingFirstName = screen.getByTestId("billingFirstName");
      const billingLastName = screen.getByTestId("billingLastName");
      const billingAddress = screen.getByTestId("billingAddress");
      const billingCity = screen.getByTestId("billingCity");
      const billingZipCode = screen.getByTestId("billingZipCode");
      const billingEmail = screen.getByTestId("billingEmail");
      const billingPhone = screen.getByTestId("billingPhone");

      await user.selectOptions(billingCountry, "Canada");
      await user.clear(billingFirstName);
      await user.type(billingFirstName, "Jane");
      await user.clear(billingLastName);
      await user.type(billingLastName, "Smith");
      await user.clear(billingAddress);
      await user.type(billingAddress, "456 Oak Avenue");
      await user.clear(billingCity);
      await user.type(billingCity, "Los Angeles");
      await user.clear(billingZipCode);
      await user.type(billingZipCode, "90210");
      await user.clear(billingEmail);
      await user.type(billingEmail, "jane.smith@example.com");
      await user.clear(billingPhone);
      await user.type(billingPhone, "+1987654321");

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/checkout-order/order-review");
      });
    });
  })

  describe("Editing fields", () => {
    test("allows editing form fields", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const firstNameInput = screen.getByTestId("shippingFirstName");
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Jane");

      expect(firstNameInput).toHaveValue("Jane");
    });
    test("allows changing shipping country", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const countrySelect = screen.getByTestId("shippingCountry");
      await user.selectOptions(countrySelect, "Canada");

      expect(countrySelect).toHaveValue("Canada");
    });
    test("allows changing phone number", async () => {
      const user = userEvent.setup();
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const phoneInput = screen.getByTestId("shippingPhone");
      await user.clear(phoneInput);
      await user.type(phoneInput, "+1987654321");

      expect(phoneInput).toHaveValue("+1987654321");
    });
  })

  describe("Submit button state", () => {
    test("submit button is not disabled by default", () => {
      render(<ShippingForm paymentMethod={mockPaymentMethod} />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).not.toBeDisabled();
    });
  });

});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeliveryOptions from "../../components/checkout/DeliveryOptions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { orderServices } from "@/services/orderServices";
import { useCheckoutStore } from "@/store/checkout";
import type { DeliveryOption } from "@/store/checkout";

jest.mock("@/services/orderServices", () => ({
  orderServices: {
    getDeliveryOptions: jest.fn(),
  },
}));

const mockOnPaymentMethodChange = jest.fn();

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
  {
    id: 3,
    name: "Fedex",
    price: 15,
    description: "5-7 business days (6 days)",
  },
  {
    id: 4,
    name: "Ukrposhta",
    price: 12,
    description: "7-10 business days (8 days)",
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

const mockGetDeliveryOptions =
  orderServices.getDeliveryOptions as unknown as jest.Mock;

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
    useCheckoutStore.getState().resetCheckout();
    mockGetDeliveryOptions.mockResolvedValue(mockDeliveryOptions);
  });

  describe("Rendering", () => {
    test("renders component with title", () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      expect(screen.getByText("Choose delivery option")).toBeInTheDocument();
    });
    test("renders all delivery options", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      await Promise.all(
        mockDeliveryOptions.map(async (option) => {
          expect(await screen.findByText(option.name)).toBeInTheDocument();
          expect(
            await screen.findByText(option.description),
          ).toBeInTheDocument();
          const prices = screen.getAllByText(`$${option.price}`);
          expect(prices.length).toBeGreaterThan(0);
        }),
      );
    });
    test("renders info message about customs duties", () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      expect(
        screen.getByText(
          /Please note that all international shipments may be subject to customs/i,
        ),
      ).toBeInTheDocument();
    });
    test("renders info icon", () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      expect(screen.getByTestId("info-icon")).toBeInTheDocument();
      expect(screen.getByTestId("info-icon")).toHaveAttribute("alt", "info");
    });
    test("renders shipping section with price", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      expect(screen.getByText("Shipping")).toBeInTheDocument();
      const prices = await screen.findAllByText(
        `$${mockDeliveryOptions[0].price}`,
      );
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe("Default selection", () => {
    test("selects first delivery option by default", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const firstRadio = await screen.findByTestId(
        `radio-input-${mockDeliveryOptions[0].id}`,
      );
      expect(firstRadio).toBeChecked();
    });
    test("displays first option price in shipping section by default", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const shippingPrices = await screen.findAllByText(
        `$${mockDeliveryOptions[0].price}`,
      );
      expect(shippingPrices.length).toBeGreaterThan(0);
    });
  });

  describe("Option selection", () => {
    test("allows selecting different delivery option", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const secondRadio = await screen.findByTestId(
        `radio-input-${mockDeliveryOptions[1].id}`,
      );
      await user.click(secondRadio);

      await waitFor(() => expect(secondRadio).toBeChecked());
    });
    test("updates shipping price when option is selected", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const secondOption = mockDeliveryOptions[1];
      const secondRadio = await screen.findByTestId(
        `radio-input-${secondOption.id}`,
      );
      await user.click(secondRadio);

      await waitFor(() => {
        const shippingPrices = screen.getAllByText(`$${secondOption.price}`);
        expect(shippingPrices.length).toBeGreaterThan(0);
      });
    });
    test("calls onPaymentMethodChange when option is selected", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const secondOption = mockDeliveryOptions[1];
      const secondRadio = await screen.findByTestId(
        `radio-input-${secondOption.id}`,
      );
      await user.click(secondRadio);

      await waitFor(() =>
        expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(secondOption),
      );
    });
    test("unchecks previous option when new option is selected", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const firstRadio = await screen.findByTestId(
        `radio-input-${mockDeliveryOptions[0].id}`,
      );
      const secondRadio = await screen.findByTestId(
        `radio-input-${mockDeliveryOptions[1].id}`,
      );

      expect(firstRadio).toBeChecked();
      expect(secondRadio).not.toBeChecked();

      await user.click(secondRadio);

      await waitFor(() => {
        expect(firstRadio).not.toBeChecked();
        expect(secondRadio).toBeChecked();
      });
    });
  });

  describe("All delivery options", () => {
    test("renders DHL option correctly", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const dhlOption = mockDeliveryOptions.find((opt) => opt.name === "DHL");
      expect(await screen.findByText("DHL")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${dhlOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(dhlOption.description),
      ).toBeInTheDocument();
    });
    test("renders Nova poshta option correctly", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const novaOption = mockDeliveryOptions.find(
        (opt) => opt.name === "Nova poshta",
      );
      expect(await screen.findByText("Nova poshta")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${novaOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(novaOption.description),
      ).toBeInTheDocument();
    });
    test("renders Fedex option correctly", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const fedexOption = mockDeliveryOptions.find(
        (opt) => opt.name === "Fedex",
      );
      expect(await screen.findByText("Fedex")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${fedexOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(fedexOption.description),
      ).toBeInTheDocument();
    });
    test("renders Ukrposhta option correctly", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const ukrOption = mockDeliveryOptions.find(
        (opt) => opt.name === "Ukrposhta",
      );
      expect(await screen.findByText("Ukrposhta")).toBeInTheDocument();
      const prices = screen.getAllByText(`$${ukrOption.price}`);
      expect(prices.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(ukrOption.description),
      ).toBeInTheDocument();
    });
  });

  describe("Price display", () => {
    test("displays correct price for each option", async () => {
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      await Promise.all(
        mockDeliveryOptions.map(async (option) => {
          await screen.findByText(option.description);
          const prices = screen.getAllByText(`$${option.price}`);
          expect(prices.length).toBeGreaterThan(0);
        }),
      );
    });
    test("updates shipping price correctly when switching options", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const thirdOption = mockDeliveryOptions[2];
      const thirdRadio = await screen.findByTestId(
        `radio-input-${thirdOption.id}`,
      );
      await user.click(thirdRadio);

      await waitFor(() => {
        const shippingPrices = screen.getAllByText(`$${thirdOption.price}`);
        expect(shippingPrices.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Multiple selections", () => {
    test("handles multiple option changes correctly", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const secondOption = mockDeliveryOptions[1];
      const thirdOption = mockDeliveryOptions[2];
      const fourthOption = mockDeliveryOptions[3];

      const secondRadio = await screen.findByTestId(
        `radio-input-${secondOption.id}`,
      );
      const thirdRadio = await screen.findByTestId(
        `radio-input-${thirdOption.id}`,
      );
      const fourthRadio = await screen.findByTestId(
        `radio-input-${fourthOption.id}`,
      );

      await user.click(secondRadio);
      await waitFor(() => expect(secondRadio).toBeChecked());
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(secondOption);

      await user.click(thirdRadio);
      await waitFor(() => expect(thirdRadio).toBeChecked());
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(thirdOption);

      await user.click(fourthRadio);
      await waitFor(() => expect(fourthRadio).toBeChecked());
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith(fourthOption);
    });
  });

  describe("Edge cases", () => {
    test("handles clicking on already selected option", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const firstRadio = await screen.findByTestId(
        `radio-input-${mockDeliveryOptions[0].id}`,
      );
      await waitFor(() => expect(firstRadio).toBeChecked());

      await user.click(firstRadio);

      await waitFor(() => expect(firstRadio).toBeChecked());
      expect(mockOnPaymentMethodChange).toHaveBeenCalled();
    });
    test("maintains selection state correctly", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(
        <DeliveryOptions onPaymentMethodChange={mockOnPaymentMethodChange} />,
      );

      const secondOption = mockDeliveryOptions[1];
      const secondRadio = await screen.findByTestId(
        `radio-input-${secondOption.id}`,
      );

      await user.click(secondRadio);
      await waitFor(() => expect(secondRadio).toBeChecked());

      await user.click(secondRadio);
      await waitFor(() => expect(secondRadio).toBeChecked());
    });
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import ProductsTable from "../../components/checkout/ProductsTable";

const mockSetSubtotal = jest.fn();

const mockCartItems = [
  {
    id: 1,
    quantity: 2,
    product: {
      id: 101,
      name: "Test Product 1",
      price: "29.99",
    },
  },
  {
    id: 2,
    quantity: 1,
    product: {
      id: 102,
      name: "Test Product 2",
      price: "15.50",
    },
  },
];

const mockUseCartQuery = jest.fn();

jest.mock("../../hooks/useCartQuery", () => ({
  useCartQuery: () => mockUseCartQuery(),
}));

describe("ProductsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSubtotal.mockClear();
  });

  describe("Rendering", () => {
    test("renders component with title", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Your order")).toBeInTheDocument();
    });
    test("renders table headers", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });
    test("renders subtotal label", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Subtotal")).toBeInTheDocument();
    });
  })

  describe("Loading state", () => {
    test("shows loading message when cart is loading", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: true,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Loading order...")).toBeInTheDocument();
    });
     test("does not show table content when loading", () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: true,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Loading order...")).toBeInTheDocument();
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });
  })

  describe("Empty cart", () => {
    test("shows empty cart message when cart is empty", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("No items in cart")).toBeInTheDocument();
    }); 
    test("calls setSubtotal with 0 when cart is empty", async () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      await waitFor(() => {
        expect(mockSetSubtotal).toHaveBeenCalledWith(0);
      });
    });
    test("displays subtotal as $0.00 when cart is empty", () => {
      mockUseCartQuery.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });
  })

  describe("Cart items display", () => {
    test("renders all cart items", () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });
    test("displays product quantities correctly", () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      const quantities = screen.getAllByText("2");
      expect(quantities.length).toBeGreaterThan(0);
      expect(screen.getByText("1")).toBeInTheDocument();
    });
    test("calculates and displays total price for each item", () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("$59.98")).toBeInTheDocument();
      expect(screen.getByText("$15.50")).toBeInTheDocument();
    });
    test("handles missing product name gracefully", () => {
      const itemsWithMissingName = [
        {
          id: 1,
          quantity: 1,
          product: {
            id: 101,
            price: "10.00",
          },
        },
      ];

      mockUseCartQuery.mockReturnValue({
        data: itemsWithMissingName,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      const productNames = screen.getAllByText("Product");
      expect(productNames.length).toBeGreaterThan(1);
    });
    test("handles missing product price gracefully", () => {
      const itemsWithMissingPrice = [
        {
          id: 1,
          quantity: 1,
          product: {
            id: 101,
            name: "Test Product",
          },
        },
      ];

      mockUseCartQuery.mockReturnValue({
        data: itemsWithMissingPrice,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
      const zeroPrices = screen.getAllByText("$0.00");
      expect(zeroPrices.length).toBeGreaterThan(0);
    });
    test("handles missing product object gracefully", () => {
      const itemsWithMissingProduct = [
        {
          id: 1,
          quantity: 1,
        },
      ];

      mockUseCartQuery.mockReturnValue({
        data: itemsWithMissingProduct,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      const productNames = screen.getAllByText("Product");
      expect(productNames.length).toBeGreaterThan(1);
      const zeroPrices = screen.getAllByText("$0.00");
      expect(zeroPrices.length).toBeGreaterThan(0);
    });
  })

  describe("Subtotal calculation", () => {
    test("calculates subtotal correctly for multiple items", async () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      await waitFor(() => {
        const expectedSubtotal = 29.99 * 2 + 15.50 * 1;
        expect(mockSetSubtotal).toHaveBeenCalledWith(expectedSubtotal);
      });
    });
    test("displays subtotal with correct formatting", () => {
      mockUseCartQuery.mockReturnValue({
        data: mockCartItems,
        isLoading: false,
      });

      render(<ProductsTable setSubtotal={mockSetSubtotal} />);

      const expectedSubtotal = (29.99 * 2 + 15.50 * 1).toFixed(2);
      expect(screen.getByText(`$${expectedSubtotal}`)).toBeInTheDocument();
    });
    test("updates subtotal when cart items change", async () => {
      const { rerender } = render(
        <ProductsTable setSubtotal={mockSetSubtotal} />
      );

      mockUseCartQuery.mockReturnValue({
        data: [mockCartItems[0]],
        isLoading: false,
      });

      rerender(<ProductsTable setSubtotal={mockSetSubtotal} />);

      await waitFor(() => {
        const expectedSubtotal = 29.99 * 2;
        expect(mockSetSubtotal).toHaveBeenCalledWith(expectedSubtotal);
      });
    });
  })

});

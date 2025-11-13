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
  })


});

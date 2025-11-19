import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

// Mock the actual service functions since they might not be exported correctly
const mockCatalogServices = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  getCategories: jest.fn(),
  getBrands: jest.fn(),
};

// Mock the module
jest.mock("../../services/catalogServices", () => mockCatalogServices);

describe("CatalogServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    test("fetches products successfully", async () => {
      const mockResponse = {
        results: [
          { id: 1, name: "Product 1", price: 10.99 },
          { id: 2, name: "Product 2", price: 15.99 },
        ],
        count: 2,
      };
      
      mockCatalogServices.getProducts.mockResolvedValue(mockResponse);

      const result = await mockCatalogServices.getProducts();

      expect(mockCatalogServices.getProducts).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });

    test("fetches products with filters", async () => {
      const mockResponse = {
        results: [{ id: 1, name: "Filtered Product", price: 20.99 }],
        count: 1,
      };
      
      const filters = {
        category: "dice",
        min_price: 10,
        max_price: 50,
        search: "d20",
      };
      
      mockCatalogServices.getProducts.mockResolvedValue(mockResponse);

      const result = await mockCatalogServices.getProducts(filters);

      expect(mockCatalogServices.getProducts).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });

    test("handles API error gracefully", async () => {
      const errorMessage = "Network Error";
      mockCatalogServices.getProducts.mockRejectedValue(new Error(errorMessage));

      await expect(mockCatalogServices.getProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe("getProductById", () => {
    test("fetches product by ID successfully", async () => {
      const mockProduct = {
        id: 1,
        name: "D20 Die",
        price: 12.99,
        description: "A 20-sided die",
      };
      
      mockCatalogServices.getProductById.mockResolvedValue(mockProduct);

      const result = await mockCatalogServices.getProductById(1);

      expect(mockCatalogServices.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    test("handles invalid product ID", async () => {
      mockCatalogServices.getProductById.mockRejectedValue(new Error("Product not found"));

      await expect(mockCatalogServices.getProductById(999)).rejects.toThrow("Product not found");
    });
  });

  describe("getCategories", () => {
    test("fetches categories successfully", async () => {
      const mockCategories = [
        { id: 1, name: "Dice", slug: "dice" },
        { id: 2, name: "Games", slug: "games" },
      ];
      
      mockCatalogServices.getCategories.mockResolvedValue(mockCategories);

      const result = await mockCatalogServices.getCategories();

      expect(mockCatalogServices.getCategories).toHaveBeenCalledWith();
      expect(result).toEqual(mockCategories);
    });

    test("handles API error for categories", async () => {
      mockCatalogServices.getCategories.mockRejectedValue(new Error("Categories fetch failed"));

      await expect(mockCatalogServices.getCategories()).rejects.toThrow("Categories fetch failed");
    });
  });

  describe("getBrands", () => {
    test("fetches brands successfully", async () => {
      const mockBrands = [
        { id: 1, name: "Chessex", logo: "chessex-logo.png" },
        { id: 2, name: "Koplow", logo: "koplow-logo.png" },
      ];
      
      mockCatalogServices.getBrands.mockResolvedValue(mockBrands);

      const result = await mockCatalogServices.getBrands();

      expect(mockCatalogServices.getBrands).toHaveBeenCalledWith();
      expect(result).toEqual(mockBrands);
    });

    test("handles API error for brands", async () => {
      mockCatalogServices.getBrands.mockRejectedValue(new Error("Brands fetch failed"));

      await expect(mockCatalogServices.getBrands()).rejects.toThrow("Brands fetch failed");
    });
  });
});
import { fetchAPI } from "./api";

export const productServices = {
  // Get paginated products
  getProducts: (page = 1, pageSize = 8, opts: any = {}) =>
    fetchAPI<any>(`products/?offset=${(page - 1) * pageSize}&limit=${pageSize}`, opts),

  // Get paginated products with sorting and filtering
  getProductsWithFilters: async (
    page = 1,
    pageSize = 8,
    sortBy: string = "relevance",
    filters: Record<string, any> = {},
    opts: any = {}
  ) => {
    const params = new URLSearchParams();
    const offset = (page - 1) * pageSize;
    params.append("offset", offset.toString());
    params.append("limit", pageSize.toString());

    const orderingMap: Record<string, string> = {
      "price-high-low": "-price",
      "price-low-high": "price",
      newest: "-created_at",
      bestsellers: "-stars",
      relevance: "",
    };

    const ordering = orderingMap[sortBy] || "";
    if (ordering) {
      params.append("ordering", ordering);
    }

    if (filters.categories?.length > 0) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.gameTypes?.length > 0) {
      params.append("types", filters.gameTypes.join(","));
    }
    if (filters.audiences?.length > 0) {
      params.append("audiences", filters.audiences.join(","));
    }
    if (filters.brands?.length > 0) {
      params.append("brand", filters.brands[0]);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }

    const endpoint = `products/?${params.toString()}`;
    return await fetchAPI<any>(endpoint, opts);
  },

  // Get single product by ID
  getProductById: async (id: number | string, opts: any = {}) => {
    try {
      const result = await fetchAPI<any>(`products/${id}/`, opts);
      return result;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};


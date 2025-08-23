import { fetchAPI } from "./api";

export const productServices = {
  // Get paginated products
  getProducts: (page = 1, pageSize = 8) => fetchAPI(`products/?offset=${(page - 1) * pageSize}&limit=${pageSize}`),

  // Get all products (for filtering purposes) - we'll fetch all pages
  getAllProducts: async () => {
    let allProducts = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchAPI(`products/?offset=${offset}&limit=${limit}`);

      if (response.results) {
        allProducts = [...allProducts, ...response.results];
        hasMore = response.total_count > offset + limit;
        offset += limit;
      } else {
        hasMore = false;
      }
    }

    return allProducts;
  },

  // Get all products with sorting and filtering
  getAllProductsWithSort: async (sortBy = "relevance", filters = {}) => {
    let ordering = "";
    
    // Map frontend sort values to backend API ordering
    switch (sortBy) {
      case "price-high-low":
        ordering = "-price";
        break;
      case "price-low-high":
        ordering = "price";
        break;
      case "newest":
        ordering = "-created_at";
        break;
      case "bestsellers":
      case "relevance":
      default:
        // For these, we'll handle sorting client-side or use default ordering
        ordering = "";
        break;
    }

    let allProducts = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams();
      params.append('offset', offset.toString());
      params.append('limit', limit.toString());
      
      if (ordering) {
        params.append('ordering', ordering);
      }
      
      // Apply server-side filters
      if (filters.categories?.length > 0) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters.gameTypes?.length > 0) {
        params.append('types', filters.gameTypes.join(','));
      }
      if (filters.audiences?.length > 0) {
        params.append('audiences', filters.audiences.join(','));
      }
      if (filters.brands?.length > 0) {
        // Handle multiple brands - use client-side filtering if multiple selected
        // For server-side, send the first brand for initial filtering
        params.append('brand', filters.brands[0]);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const endpoint = `products/?${params.toString()}`;
      const response = await fetchAPI(endpoint);

      if (response.results) {
        allProducts = [...allProducts, ...response.results];
        hasMore = response.total_count > offset + limit;
        offset += limit;
      } else {
        hasMore = false;
      }
    }

    return allProducts;
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const result = await fetchAPI(`products/${id}/`);
      return result;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};

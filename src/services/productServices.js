import { fetchAPI } from "./api";

export const productServices = {
  // Get paginated products
  getProducts: (page = 1, pageSize = 8) => fetchAPI(`products/?page=${page}&page_size=${pageSize}`),

  // Get all products (for filtering purposes) - we'll fetch all pages
  getAllProducts: async () => {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchAPI(`products/?page=${page}&page_size=50`);
      
      allProducts = [...allProducts, ...response.results];
      hasMore = response.next !== null;
      page++;
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

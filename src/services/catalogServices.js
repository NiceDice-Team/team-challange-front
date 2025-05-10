import { fetchAPI } from "./api";

export const catalogServices = {
  async getCategories() {
    try {
      const response = await fetchAPI("categories/");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

import { fetchAPI } from "./api";

export const catalogServices = {
  async getProducts() {
    const response = await fetchAPI("/products");
    return response;
  },
};

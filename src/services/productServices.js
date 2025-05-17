import { fetchAPI } from "./api";

export const productServices = {
  getProducts: () => fetchAPI("products/"),
};

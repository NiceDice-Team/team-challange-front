import { fetchAPI } from "./api";

export const catalogServices = {
  getCategories: () => fetchAPI("categories/"),
};

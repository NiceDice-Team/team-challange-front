import { fetchAPI } from "./api";

export const catalogServices = {
  getCategories: () => fetchAPI("categories/"),
  getAudiences: () => fetchAPI("audiences/"),
  getGameTypes: () => fetchAPI("game-types/"),
  getBrands: () => fetchAPI("brands/"),
};

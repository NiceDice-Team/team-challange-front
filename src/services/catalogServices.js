import { fetchAPI } from "./api";

export const catalogServices = {
  getCategories: async () => {
    const response = await fetchAPI("categories/");
    return response.results;
  },
  getAudiences: async () => {
    const response = await fetchAPI("audiences/");
    return response.results;
  },
  getGameTypes: async () => {
    const response = await fetchAPI("game-types/");
    return response.results;
  },
  getBrands: async () => {
    const response = await fetchAPI("brands/");
    return response.results;
  },
};

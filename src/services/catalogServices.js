import { fetchAPI } from "./api";

export const catalogServices = {
  getCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);
    
    const endpoint = queryParams.toString() ? `categories/?${queryParams.toString()}` : 'categories/';
    const response = await fetchAPI(endpoint);
    return response.results || response;
  },

  getAudiences: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    
    const endpoint = queryParams.toString() ? `audiences/?${queryParams.toString()}` : 'audiences/';
    const response = await fetchAPI(endpoint);
    return response.results || response;
  },

  getGameTypes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    
    const endpoint = queryParams.toString() ? `game-types/?${queryParams.toString()}` : 'game-types/';
    const response = await fetchAPI(endpoint);
    return response.results || response;
  },

  getBrands: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    
    const endpoint = queryParams.toString() ? `brands/?${queryParams.toString()}` : 'brands/';
    const response = await fetchAPI(endpoint);
    return response.results || response;
  },
};

import { fetchAPI } from "./api";

export const catalogServices = {
  getCategories: async (params: Record<string, any> = {}, fetchOpts: any = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', params.page);

    const endpoint = queryParams.toString() ? `categories/?${queryParams.toString()}` : 'categories/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return response.results || response;
  },

  getAudiences: async (params: Record<string, any> = {}, fetchOpts: any = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);

    const endpoint = queryParams.toString() ? `audiences/?${queryParams.toString()}` : 'audiences/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return response.results || response;
  },

  getGameTypes: async (params: Record<string, any> = {}, fetchOpts: any = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);

    const endpoint = queryParams.toString() ? `game-types/?${queryParams.toString()}` : 'game-types/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return response.results || response;
  },

  getBrands: async (params: Record<string, any> = {}, fetchOpts: any = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);

    const endpoint = queryParams.toString() ? `brands/?${queryParams.toString()}` : 'brands/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return response.results || response;
  },

  getProductCount: async (params: Record<string, any> = {}, fetchOpts: any = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category_id) queryParams.append('category_id', params.category_id);

    const endpoint = queryParams.toString() ? `products/count/?${queryParams.toString()}` : 'products/count/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return response;
  },
};


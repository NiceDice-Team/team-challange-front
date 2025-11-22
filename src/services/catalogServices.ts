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
    // Note: Don't use limit parameter - it incorrectly affects total_count in this API

    if (params.category_id) queryParams.append('categories', params.category_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.audiences?.length > 0) queryParams.append('audiences', params.audiences.join(','));
    if (params.gameTypes?.length > 0) queryParams.append('types', params.gameTypes.join(','));
    if (params.brands?.length > 0) queryParams.append('brand', params.brands[0]);

    const endpoint = queryParams.toString() ? `products/?${queryParams.toString()}` : 'products/';
    const response: any = await fetchAPI(endpoint, fetchOpts);
    return { count: response.total_count ?? 0 };
  },
};


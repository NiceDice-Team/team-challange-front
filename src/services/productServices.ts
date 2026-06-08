import { fetchAPI } from "./api";
import type {
  Product,
  ProductApiResponse,
  ProductGameInfoValue,
  ProductGameInformation,
  ProductListApiResponse,
  ProductListResponse,
} from "@/types/product";
import type { ApiRequestOptions } from "@/types/api";

const isGameInfoRecord = (value: unknown): value is Record<string, ProductGameInfoValue> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getGameInfoValue = (
  gameInformation: Record<string, ProductGameInfoValue>,
  aliases: string[]
): ProductGameInfoValue => {
  const matchingAlias = aliases.find((alias) => gameInformation[alias] !== undefined);
  return matchingAlias ? gameInformation[matchingAlias] : undefined;
};

const normalizeGameInformation = (gameInformation?: ProductGameInformation): ProductGameInformation | undefined => {
  if (!isGameInfoRecord(gameInformation)) {
    return gameInformation;
  }

  const normalizedGameInformation: ProductGameInformation = { ...gameInformation };
  const setNormalizedValue = (key: string, aliases: string[]) => {
    const value = getGameInfoValue(gameInformation, aliases);

    if (value !== undefined) {
      normalizedGameInformation[key] = value;
    }
  };

  setNormalizedValue("publisher", ["publisher"]);
  setNormalizedValue("players", ["players"]);
  setNormalizedValue("age", ["age", "ages"]);
  setNormalizedValue("time", ["time", "playTime", "play_time", "play time"]);
  setNormalizedValue("includes", ["includes"]);
  setNormalizedValue("gameFeatures", ["gameFeatures", "game_features", "game features"]);

  return normalizedGameInformation;
};

const normalizeProduct = (product: ProductApiResponse): Product => {
  const normalizedProduct: Product = { ...product };

  if ("short_description" in product || "shortDescription" in product) {
    normalizedProduct.shortDescription = product.short_description ?? product.shortDescription;
  }

  if ("game_information" in product || "gameInformation" in product) {
    normalizedProduct.gameInformation = normalizeGameInformation(product.game_information ?? product.gameInformation);
  }

  if ("delivery_and_payments" in product || "deliveryAndPayment" in product) {
    normalizedProduct.deliveryAndPayment = product.delivery_and_payments ?? product.deliveryAndPayment;
  }

  return normalizedProduct;
};

const normalizeProductListResponse = (response: ProductListApiResponse): ProductListResponse => ({
  ...response,
  results: Array.isArray(response.results) ? response.results.map(normalizeProduct) : [],
});

export const productServices = {
  // Get paginated products
  getProducts: async (page = 1, pageSize = 8, opts: ApiRequestOptions = {}) => {
    const response = await fetchAPI<ProductListApiResponse>(
      `products/?offset=${(page - 1) * pageSize}&limit=${pageSize}`,
      opts
    );
    return normalizeProductListResponse(response);
  },

  // Get paginated products with sorting and filtering
  getProductsWithFilters: async (
    page = 1,
    pageSize = 8,
    sortBy: string = "relevance",
    filters: Record<string, any> = {},
    opts: ApiRequestOptions = {}
  ) => {
    const params = new URLSearchParams();
    const offset = (page - 1) * pageSize;
    params.append("offset", offset.toString());
    params.append("limit", pageSize.toString());

    const orderingMap: Record<string, string> = {
      "price-high-low": "-price",
      "price-low-high": "price",
      newest: "-created_at",
      bestsellers: "-stars",
      relevance: "",
    };

    const ordering = orderingMap[sortBy] || "";
    if (ordering) {
      params.append("ordering", ordering);
    }

    if (filters.categories?.length > 0) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.gameTypes?.length > 0) {
      params.append("types", filters.gameTypes.join(","));
    }
    if (filters.audiences?.length > 0) {
      params.append("audiences", filters.audiences.join(","));
    }
    if (filters.brands?.length > 0) {
      params.append("brand", filters.brands[0]);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.priceRange?.min > 0) {
      params.append("min_price", filters.priceRange.min.toString());
    }
    if (Number.isFinite(filters.priceRange?.max)) {
      params.append("max_price", filters.priceRange.max.toString());
    }

    const endpoint = `products/?${params.toString()}`;
    const response = await fetchAPI<ProductListApiResponse>(endpoint, opts);
    return normalizeProductListResponse(response);
  },

  // Get single product by ID
  getProductById: async (id: number | string, opts: ApiRequestOptions = {}) => {
    try {
      const result = await fetchAPI<ProductApiResponse>(`products/${id}/`, opts);
      return normalizeProduct(result);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};

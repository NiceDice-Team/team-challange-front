import {
  CartStockError,
  getStockLimitMessage,
  idsMatch,
  parseStockQuantity,
} from "@/lib/cartStock";

import { API_ENDPOINTS } from "@/config/api";
import { fetchAPI, API_URL } from "./api";

const AUTH_CART_ENDPOINT = API_ENDPOINTS.cart;
const AUTH_CART_ITEM_ENDPOINT = API_ENDPOINTS.cartItem;

const getAuthCartItemEndpoint = (cartItemId: string | number) =>
  `${AUTH_CART_ITEM_ENDPOINT}${cartItemId}/`;

import {
  getValidAccessToken,
  isAuthenticated as hasValidAuthSession,
} from "@/lib/tokenManager";

import { mergeNoCacheHeaders } from "@/lib/noCacheHeaders";

import {
  getGuestToken,
  removeGuestCartFromLocalStorage,
  saveGuestCartTokenToLocalStorage,
  useGuestCartStore,
} from "@/store/guestCart";

import type { ApiRequestOptions } from "@/types/api";

import type {
  CartItem,
  GuestCartCreateResponse,
  GuestCartItemResponse,
} from "@/types/cart";

import {
  mapGuestCartItemToCartItem,
  parseAuthCartItems,
  parseCartListResponse,
} from "@/types/cart";

function findGuestCartItemById(cartItemId: string): CartItem | undefined {
  return useGuestCartStore

    .getState()

    .items.find((item) => idsMatch(item.id, cartItemId));
}

function resolveGuestProductId(cartItemId: string): number {
  const item = findGuestCartItemById(cartItemId);

  if (!item?.product?.id) {
    throw new Error(`Cart item ${cartItemId} not found`);
  }

  return Number(item.product.id);
}

function extractApiErrorMessage(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const record = errorData as Record<string, unknown>;

  if (typeof record.message === "string" && record.message) {
    return record.message;
  }

  if (typeof record.detail === "string" && record.detail) {
    return record.detail;
  }

  const errors = record.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    const firstError = errors[0] as { detail?: string };

    if (firstError.detail) {
      return firstError.detail;
    }
  }

  return fallback;
}

function isInvalidGuestCartError(status: number, message: string): boolean {
  return status === 404;
}

async function recreateGuestCart(): Promise<void> {
  if (hasValidAuthSession()) {
    return;
  }

  removeGuestCartFromLocalStorage();

  const response = await fetchAPI<GuestCartCreateResponse>("cart/guest/", {
    method: "POST",
    body: { email: "", phone: "" },
  });

  saveGuestCartTokenToLocalStorage(response.token);
}

// export const getALLGuestCarts = async () => {
//   const response = await fetchAPI<GuestCartCreateResponse>("cart/guest/", {
//     method: "GET",
//   });
//   return response;
// };

export async function ensureGuestCart(): Promise<void> {
  if (hasValidAuthSession()) {
    return;
  }

  if (getGuestToken()) {
    return;
  }

  const response = await fetchAPI<GuestCartCreateResponse>("cart/guest/", {
    method: "POST",

    body: { email: "", phone: "" },
  });

  useGuestCartStore.getState().setToken(response.token);
}

async function fetchGuestCartItemsByToken(
  token: string,
  isRetry = false,
): Promise<CartItem[]> {
  const response = await fetch(`${API_URL}cart/guest/`, {
    headers: mergeNoCacheHeaders({
      "Content-Type": "application/json",
      "X-Guest-Token": token,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch guest cart: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = extractApiErrorMessage(errorData, errorMessage);
    } catch {
      // non-JSON error body
    }

    if (!isRetry && isInvalidGuestCartError(response.status, errorMessage)) {
      await recreateGuestCart();
      const newToken = getGuestToken();

      if (newToken) {
        return fetchGuestCartItemsByToken(newToken, true);
      }
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();

  if (!text) {
    return [];
  }

  const apiItems = parseCartListResponse(JSON.parse(text));

  return apiItems.map(mapGuestCartItemToCartItem);
}

async function guestFetch<T = unknown>(
  endpoint: string,

  options: ApiRequestOptions = {},

  isRetry = false,
): Promise<T | void> {
  await ensureGuestCart();

  const token = getGuestToken();

  if (!token) {
    throw new Error("Guest cart token not available");
  }

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: options.method || "GET",

    headers: mergeNoCacheHeaders({
      "Content-Type": "application/json",

      "X-Guest-Token": token,

      ...options.headers,
    }),

    body: options.body ? JSON.stringify(options.body) : null,

    signal: options.signal,

    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `API Error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = extractApiErrorMessage(errorData, errorMessage);
    } catch {
      // non-JSON error body
    }

    if (!isRetry && isInvalidGuestCartError(response.status, errorMessage)) {
      await recreateGuestCart();
      return guestFetch<T>(endpoint, options, true);
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  return JSON.parse(text) as T;
}

export async function mergeGuestCartIntoUserCart(): Promise<void> {
  if (!hasValidAuthSession()) {
    return;
  }

  const guestToken = getGuestToken();
  let guestItems = useGuestCartStore.getState().items;

  if (guestToken) {
    try {
      guestItems = await fetchGuestCartItemsByToken(guestToken);
    } catch (error) {
      console.error("Error fetching guest cart for merge:", error);
    }
  }

  if (guestItems.length === 0) {
    return;
  }

  try {
    await cartServices.getCartId();
  } catch (error) {
    console.error("Error resolving user cart id for guest cart merge:", error);
    throw error;
  }

  for (const item of guestItems) {
    if (!item.product?.id || item.quantity <= 0) {
      continue;
    }

    try {
      await cartServices.addToCart(item.product.id, item.quantity);
    } catch (error) {
      console.error(`Error merging guest cart item ${item.product.id}:`, error);
    }
  }
}

export async function deleteGuestCart(): Promise<void> {
  const token = getGuestToken();

  if (token) {
    try {
      if (hasValidAuthSession()) {
        await fetch(`${API_URL}cart/guest/`, {
          method: "DELETE",
          headers: mergeNoCacheHeaders({
            "Content-Type": "application/json",
            "X-Guest-Token": token,
          }),
          cache: "no-store",
        });
      } else {
        await guestFetch("cart/guest/", { method: "DELETE" });
      }
    } catch (error) {
      console.error("Error deleting guest cart:", error);
    }
  }

  useGuestCartStore.getState().clearGuestCart();
}

async function getLatestProductStock(
  productId: number | string,
): Promise<number | null> {
  const product = await productServices.getProductById(productId);

  return parseStockQuantity(product?.stock);
}

async function validateAddToCartStock(
  productId: number | string,
  quantity: number,
) {
  if (quantity <= 0) {
    return;
  }

  const [productStock, cartItems] = await Promise.all([
    getLatestProductStock(productId),

    cartServices.getCartItems(),
  ]);

  const currentQuantity = cartItems.reduce((totalQuantity, item) => {
    if (!idsMatch(item.product?.id, productId)) {
      return totalQuantity;
    }

    return totalQuantity + item.quantity;
  }, 0);

  if (productStock !== null && currentQuantity + quantity > productStock) {
    throw new CartStockError(getStockLimitMessage(productStock));
  }
}

async function validateCartItemStock(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return;
  }

  const cartItems = await cartServices.getCartItems();

  const currentCartItem = cartItems.find((item) =>
    idsMatch(item.id, cartItemId),
  );

  if (!currentCartItem?.product?.id) {
    return;
  }

  const cachedStock = parseStockQuantity(currentCartItem.product.stock);

  const productStock =
    cachedStock ?? (await getLatestProductStock(currentCartItem.product.id));

  if (productStock !== null && quantity > productStock) {
    throw new CartStockError(getStockLimitMessage(productStock));
  }
}

// Cart API services

export const cartServices = {
  async getCartItems(options: ApiRequestOptions = {}): Promise<CartItem[]> {
    if (!hasValidAuthSession()) {
      try {
        await ensureGuestCart();

        if (!getGuestToken()) {
          return useGuestCartStore.getState().items;
        }

        const response = await guestFetch<unknown>("cart/guest/", {
          signal: options.signal,
        });

        const apiItems = parseCartListResponse(response);

        const items = apiItems.map(mapGuestCartItemToCartItem);

        useGuestCartStore.getState().setItems(items);

        return items;
      } catch (error) {
        console.error("Error fetching guest cart items:", error);

        return useGuestCartStore.getState().items;
      }
    }

    try {
      const accessToken = await getValidAccessToken();

      const requestOptions: ApiRequestOptions = {
        method: "GET",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (options.signal) {
        requestOptions.signal = options.signal;
      }

      const response: unknown = await fetchAPI(
        AUTH_CART_ENDPOINT,
        requestOptions,
      );

      return parseAuthCartItems(response);
    } catch (error) {
      console.error("Error fetching cart items:", error);

      return [];
    }
  },

  async getCartId(): Promise<number> {
    const accessToken = await getValidAccessToken();

    const response: { id?: number } = await fetchAPI(AUTH_CART_ENDPOINT, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return Number(response?.id ?? 0);
  },

  async addToCart(productId: number | string, quantity = 1) {
    if (!hasValidAuthSession()) {
      try {
        await validateAddToCartStock(productId, quantity);

        const response = await guestFetch<GuestCartItemResponse>(
          "cart/guest/item/",

          {
            method: "POST",

            body: {
              product_id: Number(productId),

              quantity,

              attrs: "",

              metadata: "",
            },
          },
        );

        if (response) {
          const item = mapGuestCartItemToCartItem(response);

          useGuestCartStore.getState().upsertItem(item);

          return item;
        }

        return { success: true };
      } catch (error) {
        console.error("Error adding to guest cart:", error);

        throw error;
      }
    }

    try {
      await validateAddToCartStock(productId, quantity);

      const accessToken = await getValidAccessToken();

      const response = await fetchAPI(AUTH_CART_ITEM_ENDPOINT, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        body: {
          product_id: Number(productId),

          quantity: quantity,
        },
      });

      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);

      throw error;
    }
  },

  async updateCartItem(cartItemId: string, quantity: number) {
    if (!hasValidAuthSession()) {
      try {
        await validateCartItemStock(cartItemId, quantity);

        const productId = resolveGuestProductId(cartItemId);

        const response = await guestFetch<GuestCartItemResponse>(
          "cart/guest/item/",

          {
            method: "PATCH",

            body: {
              product_id: productId,

              quantity,
            },
          },
        );

        if (response) {
          const item = mapGuestCartItemToCartItem(response);

          useGuestCartStore.getState().upsertItem(item);

          return item;
        }

        return { success: true };
      } catch (error) {
        console.error("Error updating guest cart item:", error);

        throw error;
      }
    }

    try {
      await validateCartItemStock(cartItemId, quantity);

      const accessToken = await getValidAccessToken();

      const response = await fetchAPI(getAuthCartItemEndpoint(cartItemId), {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        body: {
          quantity: quantity,
        },
      });

      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);

      throw error;
    }
  },

  async removeFromCart(cartItemId: string) {
    if (!hasValidAuthSession()) {
      try {
        const productId = resolveGuestProductId(cartItemId);

        await guestFetch("cart/guest/item/", {
          method: "DELETE",

          body: { product_id: productId },
        });

        useGuestCartStore.getState().removeItemByProductId(productId);

        return true;
      } catch (error) {
        console.error("Error removing from guest cart:", error);

        throw error;
      }
    }

    try {
      const accessToken = await getValidAccessToken();

      await fetchAPI(getAuthCartItemEndpoint(cartItemId), {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);

      throw error;
    }
  },

  async clearGuestCartItems(): Promise<void> {
    if (hasValidAuthSession()) {
      return;
    }

    try {
      await guestFetch("cart/guest/clear/", { method: "DELETE" });

      useGuestCartStore.getState().setItems([]);
    } catch (error) {
      console.error("Error clearing guest cart:", error);

      throw error;
    }
  },
};

// Product API services for recommendations

export const productServices = {
  async getProductById(productId: number | string) {
    try {
      const response = await fetchAPI(`products/${productId}/`);

      return response as CartItem["product"];
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);

      throw error;
    }
  },

  async getRandomProducts(limit = 5) {
    try {
      const response: { results?: CartItem["product"][] } = await fetchAPI(
        `products/?limit=20&ordering=-created_at`,
      );

      const products = response.results || (response as CartItem["product"][]);

      const shuffled = [...products].sort(() => Math.random() - 0.5);

      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Error fetching random products:", error);

      return [] as CartItem["product"][];
    }
  },

  async getProducts(params: Record<string, unknown> = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append("search", String(params.search));

      if (params.brand) queryParams.append("brand", String(params.brand));

      if (params.categories)
        queryParams.append("categories", String(params.categories));

      if (params.audiences)
        queryParams.append("audiences", String(params.audiences));

      if (params.types) queryParams.append("types", String(params.types));

      if (params.ordering)
        queryParams.append("ordering", String(params.ordering));

      if (params.limit) queryParams.append("limit", String(params.limit));

      if (params.offset !== undefined)
        queryParams.append("offset", String(params.offset));

      const response: { results?: CartItem["product"][] } = await fetchAPI(
        `products/?${queryParams.toString()}`,
      );

      return response.results || (response as CartItem["product"][]);
    } catch (error) {
      console.error("Error fetching products:", error);

      return [] as CartItem["product"][];
    }
  },
};

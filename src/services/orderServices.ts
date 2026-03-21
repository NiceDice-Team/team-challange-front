import { fetchAPI } from "./api";
import { getTokens } from "@/lib/tokenManager";
import type { DeliveryOption, DeliveryOptionResponse } from "@/types/order";

export const orderServices = {
  async getOrders(userId?: string | null) {
    const { accessToken } = getTokens() || {};
    
    if (!userId) {
      throw new Error("User must be authenticated to fetch orders");
    }

    try {
      const response = await fetchAPI("orders/?user_id=" + userId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.results || response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  async getDeliveryOptions(signal?: AbortSignal): Promise<DeliveryOption[]> {
    try {
      const requestOptions = signal
        ? {
            method: "GET" as const,
            signal,
          }
        : {
            method: "GET" as const,
          };

      const response = await fetchAPI<DeliveryOptionResponse[]>(
        "orders/delivery-options/",
        requestOptions
      );

      return response.map((option) => ({
        id: option.id,
        name: option.name,
        description: option.description,
        price: Number(option.price),
        estimatedDays: option.estimated_days,
      }));
    } catch (error) {
      console.error("Error fetching delivery options:", error);
      throw error;
    }
  },
};

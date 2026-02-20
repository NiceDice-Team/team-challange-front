import { fetchAPI } from "./api";
import { getTokens } from "@/lib/tokenManager";
import type { DeliveryOption } from "@/store/checkout";

export const orderServices = {
  async getOrders(userId) {
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

  async getDeliveryOptions() {
    const { accessToken } = getTokens() || {};

    const response = await fetchAPI("orders/delivery-options/", {
      method: "GET",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    const rawItems: any[] = (response as any)?.results || (response as any);

    return (rawItems || []).map((item: any): DeliveryOption => ({
      id: Number(item.id),
      name: String(item.name ?? ""),
      price: Number(item.price),
      description:
        String(item.description ?? "") +
        (item.estimated_days != null ? ` (${item.estimated_days} days)` : ""),
    }));
  },
};

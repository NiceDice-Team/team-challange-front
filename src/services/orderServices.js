import { fetchAPI } from "./api.js";
import { getTokens } from "@/lib/tokenManager";

const { accessToken } = getTokens();
export const orderServices = {
  async getOrders(userId) {
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
};

import { fetchAPI } from "./api";
import { getTokens } from "@/lib/tokenManager";
import type { CheckoutFormData, DeliveryOption } from "@/store/checkout";

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

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

  async getPaymentMethods() {
    const { accessToken } = getTokens() || {};

    const response = await fetchAPI("orders/payment-methods/", {
      method: "GET",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    const rawItems: any[] = (response as any)?.results || (response as any);

    return (rawItems || []).map((item: any): PaymentMethod => ({
      id: Number(item.id),
      name: String(item.name ?? ""),
      description: String(item.description ?? ""),
    }));
  },

  async createOrder({
    checkoutUserData,
    deliveryOptionId,
    paymentMethodId,
    cartId = 0,
    delivery_option = 0,
    payment_method = 0,
  }: {
    checkoutUserData: CheckoutFormData;
    deliveryOptionId: number;
    paymentMethodId: number;
    cartId?: number;
    delivery_option?: number;
    payment_method?: number;
  }) {
    const { accessToken } = getTokens() || {};

    const buildAddressString = (
      prefix: "shipping" | "billing"
    ): string => {
      const country = (checkoutUserData as any)[`${prefix}Country`] as
        | string
        | undefined;
      const firstName = (checkoutUserData as any)[
        `${prefix}FirstName`
      ] as string | undefined;
      const lastName = (checkoutUserData as any)[
        `${prefix}LastName`
      ] as string | undefined;
      const address = (checkoutUserData as any)[`${prefix}Address`] as
        | string
        | undefined;
      const apartment = (checkoutUserData as any)[
        `${prefix}Apartment`
      ] as string | undefined;
      const zipCode = (checkoutUserData as any)[`${prefix}ZipCode`] as
        | string
        | undefined;
      const city = (checkoutUserData as any)[`${prefix}City`] as
        | string
        | undefined;
      const email = (checkoutUserData as any)[`${prefix}Email`] as
        | string
        | undefined;
      const phone = (checkoutUserData as any)[`${prefix}Phone`] as
        | string
        | undefined;

      return [
        country,
        firstName,
        lastName,
        address,
        apartment,
        zipCode,
        city,
        email,
        phone,
      ]
        .map((v) => (v ?? "").trim())
        .filter(Boolean)
        .join(", ");
    };

    const payload = {
      delivery_option,
      payment_method,
      shipping_address: buildAddressString("shipping"),
      billing_address: buildAddressString("billing"),
      delivery_option_id: deliveryOptionId ?? 0,
      payment_method_id: paymentMethodId ?? 0,
      cart_id: cartId ?? 0,
    };

    const response = await fetchAPI("orders/", {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: payload,
    });

    return response;
  },
};

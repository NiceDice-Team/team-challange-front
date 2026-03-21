"use client";

import { useQuery } from "@tanstack/react-query";
import { orderServices } from "@/services/orderServices";
import type { DeliveryOption } from "@/types/order";

const DELIVERY_OPTIONS_QUERY_KEY = ["delivery-options"] as const;

export function useDeliveryOptionsQuery() {
  return useQuery<DeliveryOption[]>({
    queryKey: DELIVERY_OPTIONS_QUERY_KEY,
    queryFn: ({ signal }) => orderServices.getDeliveryOptions(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

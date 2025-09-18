"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderServices } from "@/services/orderServices";
import { Order } from "@/lib/definitions";

const ORDERS_QUERY_KEY = ["orders"];

export function useOrdersQuery(userId) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, userId],
    queryFn: () => orderServices.getOrders(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

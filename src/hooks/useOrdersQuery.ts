"use client";

import { useQuery } from "@tanstack/react-query";
import { orderServices } from "@/services/orderServices";
import { queryKeys } from "@/lib/queryKeys";

export function useOrdersQuery(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.ordersByUser(userId),
    queryFn: () => orderServices.getOrders(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

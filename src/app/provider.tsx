"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Application providers wrapper
 * Combines QueryClient, SessionProvider, and CartProvider
 */
export default function Providers({ children }: ProvidersProps): React.ReactElement {
  // This ensures that data is not shared between different users and requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configure default options here
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 5 * 60 * 1000, // cache garbage collect after 5 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

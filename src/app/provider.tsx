"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AUTH_TOKENS_CHANGED_EVENT } from "@/lib/tokenManager";
import { queryKeys } from "@/lib/queryKeys";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Application providers wrapper
 * Combines QueryClient and SessionProvider.
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
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const handleAuthTokensChanged = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.removeQueries({ queryKey: queryKeys.orders });
      queryClient.removeQueries({ queryKey: queryKeys.user });
    };

    window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, handleAuthTokensChanged);

    return () => {
      window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, handleAuthTokensChanged);
    };
  }, [queryClient]);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

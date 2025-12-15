import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client configuration
 * Global settings for all queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 2 times before giving up
      retry: 2,
      
      // Refetch on window focus (useful for web)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Consider data stale after 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations 1 time
      retry: 1,
    },
  },
});

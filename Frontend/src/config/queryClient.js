/**
 * TanStack React Query Client Configuration
 *
 * Creates and exports the QueryClient instance used throughout the app.
 * Default options are set here so individual queries don't need to
 * repeat them. The QueryClientProvider in main.jsx wraps the entire
 * component tree with this client.
 */

import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute before a background re-fetch
      staleTime: 1000 * 60,
      // Keep inactive query data in cache for 5 minutes
      gcTime: 1000 * 60 * 5,
      // Retry failed requests once before surfacing the error
      retry: 1,
      // Do not re-fetch when the browser window regains focus in development
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export default queryClient

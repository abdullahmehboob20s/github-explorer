"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: (failureCount, error) => {
              // // Don't retry on 4xx errors (client errors)
              // if (error.message.includes("Bad request") || error.message.includes("Resource not found")) {
              //   return false
              // }
              // // Retry on 5xx errors and network errors up to 2 times
              // if (error.message.includes("Server error") || error.message.includes("Network error")) {
              //   return failureCount < 2
              // }
              return false
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry mutations on client errors
              if (error.message.includes("Bad request") || error.message.includes("Resource not found")) {
                return false
              }
              // Retry on server errors up to 1 time
              if (error.message.includes("Server error") || error.message.includes("Network error")) {
                return failureCount < 1
              }
              return false
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

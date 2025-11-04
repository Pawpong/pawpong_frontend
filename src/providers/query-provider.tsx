"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 신선한 상태 유지
            retry: 1, // 실패 시 1번만 재시도
            refetchOnWindowFocus: false, // 탭 이동 시 리패치 X
            refetchOnReconnect: true, // 네트워크 복구 시 다시 시도
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

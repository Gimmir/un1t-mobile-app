import { useFetch } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceSummary,
} from "@/src/features/performance/api/performance.api";

export function usePerformanceSummary(userId?: string | null) {
  return useFetch<PerformanceSummary>(
    ["performance", "summary", userId],
    () => performanceApi.getSummary(String(userId)),
    {
      enabled: Boolean(userId),
      staleTime: 30 * 1000,
    },
  );
}

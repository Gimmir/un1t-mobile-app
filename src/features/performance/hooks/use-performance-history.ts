import { useFetch } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceHistoryRecord,
} from "@/src/features/performance/api/performance.api";

type HistoryParams = {
  userId?: string | null;
  slug?: string | null;
  type?: string | null;
  startDate?: string;
  endDate?: string;
};

export function usePerformanceHistory(params: HistoryParams) {
  const { userId, slug, type, startDate, endDate } = params;

  return useFetch<PerformanceHistoryRecord[]>(
    [
      "performance",
      "history",
      userId,
      slug,
      type,
      startDate,
      endDate,
    ],
    () =>
      performanceApi.getHistory({
        userId: String(userId),
        slug: String(slug),
        type: String(type),
        startDate,
        endDate,
      }),
    {
      enabled: Boolean(userId && slug && type),
      staleTime: 30 * 1000,
    },
  );
}

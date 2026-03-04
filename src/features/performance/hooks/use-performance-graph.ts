import { useFetch } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceGraphRecord,
} from "@/src/features/performance/api/performance.api";

type GraphParams = {
  userId?: string | null;
  slug?: string | null;
  type?: string | null;
  period?: string | null;
  startDate?: string;
  endDate?: string;
};

export function usePerformanceGraph(params: GraphParams) {
  const { userId, slug, type, period, startDate, endDate } = params;

  return useFetch<PerformanceGraphRecord[]>(
    [
      "performance",
      "graph",
      userId,
      slug,
      type,
      period,
      startDate,
      endDate,
    ],
    () =>
      performanceApi.getGraph({
        userId: String(userId),
        slug: String(slug),
        type: String(type),
        period: String(period),
        startDate,
        endDate,
      }),
    {
      enabled: Boolean(userId && slug && type && period),
      staleTime: 30 * 1000,
    },
  );
}

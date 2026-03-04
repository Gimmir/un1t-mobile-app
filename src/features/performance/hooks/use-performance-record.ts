import { useFetch } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceSpecificRecord,
} from "@/src/features/performance/api/performance.api";

type RecordParams = {
  userId?: string | null;
  slug?: string | null;
  type?: string | null;
};

export function usePerformanceRecord(params: RecordParams) {
  const { userId, slug, type } = params;

  return useFetch<PerformanceSpecificRecord | null>(
    ["performance", "record", userId, slug, type],
    () =>
      performanceApi.getRecord({
        userId: String(userId),
        slug: String(slug),
        type: String(type),
      }),
    {
      enabled: Boolean(userId && slug && type),
      staleTime: 30 * 1000,
    },
  );
}

import { useMutate } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceLogPayload,
} from "@/src/features/performance/api/performance.api";
import { queryClient } from "@/src/lib/query-client";

export function usePerformanceLog() {
  return useMutate<unknown, Error, PerformanceLogPayload>(
    (payload) => performanceApi.log(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["performance"] });
      },
    },
  );
}

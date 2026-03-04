import { useMutate } from "@/src/hooks/useFetch";
import {
  performanceApi,
  type PerformanceLogPayload,
} from "@/src/features/performance/api/performance.api";
import { queryClient } from "@/src/lib/query-client";

type UpdateLogParams = { id: string; payload: PerformanceLogPayload };

export function useUpdatePerformanceLog() {
  return useMutate<unknown, Error, UpdateLogParams>(
    ({ id, payload }) => performanceApi.updateLogEntry(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["performance"] });
      },
    },
  );
}

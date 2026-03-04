import { useMutate } from "@/src/hooks/useFetch";
import { performanceApi } from "@/src/features/performance/api/performance.api";
import { queryClient } from "@/src/lib/query-client";

export function useDeletePerformanceLog() {
  return useMutate<unknown, Error, string>(
    (id) => performanceApi.deleteLogEntry(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["performance"] });
      },
    },
  );
}

import { useFetch } from "@/src/hooks/useFetch";
import { phasesApi, type CurrentPhase } from "../api/phases.api";

export function useCurrentPhase(enabled = true) {
  return useFetch<CurrentPhase | null>(
    ["phases", "current"],
    () => phasesApi.getCurrentPhase(),
    {
      enabled,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

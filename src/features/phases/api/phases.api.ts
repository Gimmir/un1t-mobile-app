import { api } from "@/src/lib/axios";

export type CurrentPhase = {
  _id: string;
  creator: string;
  startDate: string;
  endDate: string;
  title: string;
  reps?: string | number | null;
  percentage?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as Record<string, unknown>).data;
    if (data && typeof data === "object" && "data" in data) {
      return (data as Record<string, unknown>).data as T;
    }
    return data as T;
  }
  return response as T;
}

export const phasesApi = {
  getCurrentPhase: async () => {
    const response = await api.get<unknown>("/phases/current");
    const data = unwrapData<CurrentPhase | null>(response);
    if (!data || typeof data !== "object") return null;
    return data;
  },
};

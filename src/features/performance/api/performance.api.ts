import { api } from "@/src/lib/axios";

export type PerformanceLogPayload = {
  kind: "exercise" | "measurement";
  name: string;
  slug: string;
  type: string;
  value: number;
  date: string;
  targetValue?: number;
  targetDate?: string;
};

export type PerformanceTarget = {
  value?: number | string | null;
  date?: string | null;
  unit?: string | null;
};

export type PerformanceRecordValue = {
  date: string;
  value: number;
  unit?: string;
  targetValue?: number | string | null;
  targetDate?: string | null;
  target?: PerformanceTarget | null;
};

export type PerformanceExerciseSummary = {
  name: string;
  slug: string;
  type: string;
  latest?: PerformanceRecordValue | null;
  previous?: PerformanceRecordValue | null;
  best?: PerformanceRecordValue | null;
  targetValue?: number | string | null;
  targetDate?: string | null;
  target?: PerformanceTarget | null;
};

export type PerformanceMeasurementSummary = {
  name: string;
  slug: string;
  type: string;
  latest?: PerformanceRecordValue | null;
  previous?: PerformanceRecordValue | null;
  targetValue?: number | string | null;
  targetDate?: string | null;
  target?: PerformanceTarget | null;
};

export type PerformanceSummary = {
  units?: string;
  exercises?: PerformanceExerciseSummary[];
  measurements?: PerformanceMeasurementSummary[];
};

export type PerformanceHistoryRecord = {
  _id: string;
  value: number;
  unit?: string;
  date: string;
};

export type PerformanceGraphRecord = {
  period: string;
  avg?: number;
  max?: number;
  min?: number;
  count?: number;
  unit?: string;
};

export type PerformanceSpecificRecord =
  | PerformanceExerciseSummary
  | PerformanceMeasurementSummary
  | (Record<string, unknown> & {
      latest?: PerformanceRecordValue | null;
      previous?: PerformanceRecordValue | null;
      best?: PerformanceRecordValue | null;
    });

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

function buildQuery(params: { startDate?: string; endDate?: string }) {
  const parts: string[] = [];
  if (params.startDate) {
    parts.push(`startDate=${encodeURIComponent(params.startDate)}`);
  }
  if (params.endDate) {
    parts.push(`endDate=${encodeURIComponent(params.endDate)}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export const performanceApi = {
  log: (payload: PerformanceLogPayload) =>
    api.post<unknown, PerformanceLogPayload>("/performance/log", payload),
  updateLogEntry: (id: string, payload: PerformanceLogPayload) =>
    api.patch<unknown, PerformanceLogPayload>(`/performance/log/${id}`, payload),
  deleteLogEntry: (id: string) => api.delete<unknown>(`/performance/log/${id}`),
  getSummary: async (userId: string) => {
    const response = await api.get<unknown>(`/performance/${userId}`);
    const summary = unwrapData<PerformanceSummary | null>(response);
    return summary ?? { units: "metric", exercises: [], measurements: [] };
  },
  getRecord: async (params: { userId: string; slug: string; type: string }) => {
    const { userId, slug, type } = params;
    const response = await api.get<unknown>(`/performance/${userId}/${slug}/${type}`);
    return unwrapData<PerformanceSpecificRecord | null>(response);
  },
  getHistory: async (params: {
    userId: string;
    slug: string;
    type: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const { userId, slug, type, startDate, endDate } = params;
    const suffix = buildQuery({ startDate, endDate });
    const response = await api.get<unknown>(
      `/performance/${userId}/${slug}/${type}/history${suffix}`,
    );
    const data = unwrapData<PerformanceHistoryRecord[] | null>(response);
    return Array.isArray(data) ? data : [];
  },
  getGraph: async (params: {
    userId: string;
    slug: string;
    type: string;
    period: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const { userId, slug, type, period, startDate, endDate } = params;
    const suffix = buildQuery({ startDate, endDate });
    const response = await api.get<unknown>(
      `/performance/${userId}/${slug}/${type}/graph/${period}${suffix}`,
    );
    const data = unwrapData<PerformanceGraphRecord[] | null>(response);
    return Array.isArray(data) ? data : [];
  },
};

import type {
  PerformanceRecordValue,
  PerformanceTarget,
} from "@/src/features/performance/api/performance.api";

type TargetCarrier = {
  targetValue?: number | string | null;
  targetDate?: string | null;
  target?: PerformanceTarget | null;
  latest?: PerformanceRecordValue | null;
};

export function resolveTargetValue(source?: TargetCarrier) {
  const candidates: Array<number | string | null | undefined> = [
    source?.targetValue,
    source?.target?.value,
    source?.latest?.targetValue,
    source?.latest?.target?.value,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return String(candidate);
    }
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

export function resolveTargetDate(source?: TargetCarrier) {
  const candidates: Array<string | null | undefined> = [
    source?.targetDate,
    source?.target?.date,
    source?.latest?.targetDate,
    source?.latest?.target?.date,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

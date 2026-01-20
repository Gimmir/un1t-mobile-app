import type { BodyCompositionMetric } from '@/components/performance';
import { BODY_COMPOSITION } from '@/components/performance-screen/performance-data';

export type BodyCompositionMetricDetails = BodyCompositionMetric & {
  detailTitle?: string;
  targetDate?: string;
  helpTitle?: string;
};

export const normalizeUnit = (unit?: string) => {
  if (!unit || typeof unit !== 'string') return '';
  return unit.trim().toUpperCase();
};

export const resolveBodyCompositionMetric = (id?: string, label?: string) => {
  if (typeof id === 'string' && id.trim()) {
    const match = BODY_COMPOSITION.find((metric) => metric.id === id);
    if (match) return match as BodyCompositionMetricDetails;
  }

  if (typeof label === 'string' && label.trim()) {
    const normalized = label.trim().toUpperCase();
    const match = BODY_COMPOSITION.find(
      (metric) =>
        metric.label.toUpperCase() === normalized ||
        (metric.detailTitle ?? '').toUpperCase() === normalized
    );
    if (match) return match as BodyCompositionMetricDetails;
  }

  return BODY_COMPOSITION[0] as BodyCompositionMetricDetails | undefined;
};

export const resolveBodyCompositionTitle = (
  metric: BodyCompositionMetricDetails | undefined,
  fallbackLabel?: string
) => {
  if (metric?.detailTitle) return metric.detailTitle;
  if (metric?.label) return metric.label;
  if (fallbackLabel && fallbackLabel.trim()) return fallbackLabel.trim();
  return 'Body Composition';
};

export const slugifyMetric = (value: string) => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'metric';
};

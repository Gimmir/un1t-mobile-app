import { parseDob } from '@/components/profile/account-details/account-details.utils';
import type { BodyCompositionMetricDetails } from './body-composition-utils';

const DEFAULT_DESCRIPTION =
  "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.";

export type BodyCompositionInfoContent = {
  title: string;
  description: string;
  targetRangeTitle?: string;
  targetRangeSubtitle?: string;
  ranges?: { label: string; value: string }[];
};

export const parseTargetDate = (value?: string) => {
  if (typeof value !== 'string' || !value.trim()) return new Date();
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const parsed = new Date(year, month, day);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return new Date();
};

export const clampToMinDate = (value: Date, minDate: Date) =>
  value.getTime() < minDate.getTime() ? minDate : value;

export const formatTargetDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = String(value.getFullYear());
  return `${day}.${month}.${year}`;
};

export const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const normalizeGender = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.toLowerCase() === 'prefer not to say') {
    return 'Prefer not to say';
  }
  return trimmed;
};

const resolveGenderFromCandidate = (candidate: unknown) => {
  if (typeof candidate === 'string') return normalizeGender(candidate);
  if (candidate && typeof candidate === 'object') {
    const record = candidate as { label?: unknown; name?: unknown; value?: unknown };
    const nested = record.label ?? record.name ?? record.value;
    if (typeof nested === 'string') return normalizeGender(nested);
  }
  return '';
};

export const resolveUserGenderLabel = (user: unknown) => {
  if (!user || typeof user !== 'object') return '';
  const record = user as {
    gender?: unknown;
    sex?: unknown;
    profile?: { gender?: unknown; sex?: unknown };
    personalInfo?: { gender?: unknown; sex?: unknown };
  };

  const candidates = [
    record.gender,
    record.sex,
    record.profile?.gender,
    record.profile?.sex,
    record.personalInfo?.gender,
    record.personalInfo?.sex,
  ];

  for (const candidate of candidates) {
    const resolved = resolveGenderFromCandidate(candidate);
    if (resolved) return resolved;
  }

  return '';
};

export const resolveUserAge = (user: unknown) => {
  if (!user || typeof user !== 'object') return null;
  const record = user as { birthday?: string; dob?: string };
  const rawDob = record.birthday || record.dob || '';
  const parsedDob = parseDob(rawDob);
  if (!parsedDob) return null;

  const now = new Date();
  let age = now.getFullYear() - parsedDob.getFullYear();
  const monthDelta = now.getMonth() - parsedDob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < parsedDob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

export const buildTargetRangeSubtitle = (user: unknown) => {
  const parts: string[] = [];
  const gender = resolveUserGenderLabel(user);
  if (gender) parts.push(gender);

  const age = resolveUserAge(user);
  if (typeof age === 'number') parts.push(`${age} years old`);

  if (parts.length === 0) return '--';
  return parts.join(' ').toUpperCase();
};

export const buildBodyCompositionInfoContent = (
  metric: BodyCompositionMetricDetails | undefined,
  resolvedTitle: string,
  targetRangeSubtitle: string
): BodyCompositionInfoContent => {
  if (metric?.id === 'body-fat') {
    return {
      title: resolvedTitle,
      description: DEFAULT_DESCRIPTION,
      targetRangeTitle: 'Healthy target ranges',
      targetRangeSubtitle,
      ranges: [
        { label: 'Lean', value: '13-20%' },
        { label: 'Ideal', value: '21-25%' },
        { label: 'Average', value: '25-31%' },
        { label: 'Overfat', value: '31-36%' },
      ],
    };
  }

  if (metric?.id === 'weight' || metric?.id === 'waist') {
    return {
      title: resolvedTitle,
      description: DEFAULT_DESCRIPTION,
    };
  }

  return {
    title: resolvedTitle,
    description: DEFAULT_DESCRIPTION,
    targetRangeTitle: 'Healthy target ranges',
    targetRangeSubtitle: 'Personalized',
    ranges: [
      { label: 'Lean', value: '--' },
      { label: 'Ideal', value: '--' },
      { label: 'Average', value: '--' },
      { label: 'Overfat', value: '--' },
    ],
  };
};

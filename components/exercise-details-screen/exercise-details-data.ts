export const REP_COUNTS = [1, 3, 5] as const;
export const REP_TABS = ['1 REP', '3 REPS', '5 REPS'] as const;
export const CTA_HEIGHT = 48;
export const CTA_TOP_PADDING = 18;

export const FILTER_OPTIONS = ['Weekly', 'Monthly', 'Yearly'] as const;
export type FilterOption = (typeof FILTER_OPTIONS)[number];

export const FILTER_DATA: { id: FilterOption; label: string }[] = FILTER_OPTIONS.map((option) => ({
  id: option,
  label: option,
}));

export type ExerciseScoreDatum = {
  label: string;
  value: number;
};

export const MONTHLY_DATA: ExerciseScoreDatum[] = [
  { label: 'Jan', value: 35 },
  { label: 'Feb', value: 38 },
  { label: 'Mar', value: 62 },
  { label: 'Apr', value: 82 },
  { label: 'May', value: 85 },
  { label: 'Jun', value: 86 },
  { label: 'Jul', value: 92 },
  { label: 'Aug', value: 100 },
  { label: 'Sep', value: 100 },
  { label: 'Oct', value: 92 },
  { label: 'Nov', value: 94 },
  { label: 'Dec', value: 84 },
];

export const WEEKLY_DATA: ExerciseScoreDatum[] = [
  { label: 'Mon', value: 78 },
  { label: 'Tue', value: 82 },
  { label: 'Wed', value: 85 },
  { label: 'Thu', value: 79 },
  { label: 'Fri', value: 88 },
  { label: 'Sat', value: 92 },
  { label: 'Sun', value: 90 },
];

export const YEARLY_DATA: ExerciseScoreDatum[] = [
  { label: '2021', value: 45 },
  { label: '2022', value: 62 },
  { label: '2023', value: 78 },
  { label: '2024', value: 85 },
  { label: '2025', value: 92 },
];

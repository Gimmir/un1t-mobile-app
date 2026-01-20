import { useMemo } from 'react';
import {
  MONTHLY_DATA,
  WEEKLY_DATA,
  YEARLY_DATA,
  type ExerciseScoreDatum,
  type FilterOption,
} from './exercise-details-data';

type ChartDatum = {
  value: number;
  label: string;
  frontColor: string;
  gradientColor: string;
};

const resolveSourceData = (selectedFilter: FilterOption): ExerciseScoreDatum[] => {
  if (selectedFilter === 'Weekly') return WEEKLY_DATA;
  if (selectedFilter === 'Yearly') return YEARLY_DATA;
  return MONTHLY_DATA;
};

export function useExerciseScoreData(selectedFilter: FilterOption) {
  const chartData = useMemo<ChartDatum[]>(() => {
    const rawData = resolveSourceData(selectedFilter);

    return rawData.map((item) => ({
      value: item.value,
      label: item.label,
      frontColor: '#FFFFFF',
      gradientColor: '#FFFFFF80',
    }));
  }, [selectedFilter]);

  const maxValue = useMemo(() => {
    const rawData = resolveSourceData(selectedFilter);
    const maxVal = Math.max(...rawData.map((item) => item.value));
    const withPadding = maxVal * 1.2;
    return Math.ceil(withPadding / 10) * 10;
  }, [selectedFilter]);

  return { chartData, maxValue };
}

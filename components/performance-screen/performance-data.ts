import type { BodyCompositionMetric, ExerciseCardData } from '@/components/performance';

export const FALLBACK_IMAGE = require('@/assets/images/schedule-bg.png');

export const EXERCISE_CARDS: ExerciseCardData[] = [
  {
    id: 'squat',
    name: 'Squat',
    weight: '160 KG',
    image: require('@/assets/images/perfomans/Squat.jpg'),
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    weight: '190 KG',
    image: require('@/assets/images/perfomans/Deadlift.jpg'),
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    weight: '110 KG',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80',
  },
];

export const BODY_COMPOSITION: BodyCompositionMetric[] = [
  {
    id: 'body-fat',
    label: 'BODY FAT',
    detailTitle: 'BODY FAT %',
    icon: 'fire',
    current: { value: '31', unit: '%' },
    target: { value: '22', unit: '%' },
    targetDate: '11.11.2020',
    helpTitle: 'What is Body Fat %',
  },
  {
    id: 'weight',
    label: 'WEIGHT',
    detailTitle: 'WEIGHT',
    icon: 'scale-bathroom',
    current: { value: '72', unit: 'kg' },
    target: { value: '60', unit: 'kg' },
    targetDate: '11.11.2020',
    helpTitle: 'What is Weight',
  },
  {
    id: 'waist',
    label: 'WAIST\nCIRCUMFERENCE',
    detailTitle: 'WAIST CIRCUMFERENCE',
    icon: 'ruler',
    current: { value: '80', unit: 'cm' },
    target: { value: '72', unit: 'cm' },
    targetDate: '11.11.2020',
    helpTitle: 'What is Waist Circumference',
  },
];

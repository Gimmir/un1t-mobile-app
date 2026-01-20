import {
  BodyCompositionSection,
  ExerciseListSection,
  type BodyCompositionMetric,
  type ExerciseCardData,
} from '@/components/performance';
import { ScrollView, StyleSheet } from 'react-native';
import { BODY_COMPOSITION, EXERCISE_CARDS, FALLBACK_IMAGE } from './performance-data';

type PerformanceContentProps = {
  scrollBottomPadding: number;
  cardWidth: number;
  onPressExercise: (exercise: ExerciseCardData) => void;
  onPressMetric: (metric: BodyCompositionMetric) => void;
};

export function PerformanceContent({
  scrollBottomPadding,
  cardWidth,
  onPressExercise,
  onPressMetric,
}: PerformanceContentProps) {
  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <ExerciseListSection
        title="1 REP MAX"
        exercises={EXERCISE_CARDS}
        fallbackImage={FALLBACK_IMAGE}
        onPressExercise={onPressExercise}
      />

      <BodyCompositionSection
        title="BODY COMPOSITION"
        metrics={BODY_COMPOSITION}
        cardWidth={cardWidth}
        onPressMetric={onPressMetric}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
});

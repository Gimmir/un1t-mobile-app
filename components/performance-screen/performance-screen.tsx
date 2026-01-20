import { HomeTopBackground } from '@/components/home';
import {
  PerformanceHeader,
  type BodyCompositionMetric,
  type ExerciseCardData,
} from '@/components/performance';
import { TAB_HEIGHT } from '@/components/tabs';
import { colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PerformanceContent } from './performance-content';

export function PerformanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scrollBottomPadding = Math.max(insets.bottom, 16) + TAB_HEIGHT + 24;
  const cardWidth = (width - 32) * 0.6;

  const handlePressExercise = (exercise: ExerciseCardData) =>
    router.push({
      pathname: '/exercise-details/[id]',
      params: {
        id: exercise.id,
        name: exercise.name,
        weight: exercise.weight,
      },
    });

  const handlePressMetric = (metric: BodyCompositionMetric) =>
    router.push({
      pathname: '/body-composition/[id]',
      params: {
        id: metric.id,
        label: metric.label,
      },
    });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <HomeTopBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <PerformanceHeader />
        <PerformanceContent
          scrollBottomPadding={scrollBottomPadding}
          cardWidth={cardWidth}
          onPressExercise={handlePressExercise}
          onPressMetric={handlePressMetric}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  safeArea: {
    flex: 1,
  },
});

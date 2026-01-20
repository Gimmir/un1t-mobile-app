import { ClassDetailsBottomCta } from '@/components/class-details-screen/bottom-cta';
import {
  ExerciseDetailsHeader,
  ExerciseLatestResultCard,
  ExerciseScoreSection,
} from '@/components/exercise-details';
import { ExerciseFilterModal } from '@/components/exercise-details-screen/exercise-filter-modal';
import {
  CTA_HEIGHT,
  CTA_TOP_PADDING,
  type FilterOption,
} from '@/components/exercise-details-screen/exercise-details-data';
import { useExerciseScoreData } from '@/components/exercise-details-screen/use-exercise-score-data';
import {
  normalizeUnit,
  resolveBodyCompositionMetric,
  resolveBodyCompositionTitle,
  slugifyMetric,
} from '@/components/body-composition-details-screen/body-composition-utils';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BodyCompositionDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('Monthly');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { id, label } = useLocalSearchParams<{ id?: string; label?: string }>();

  const metric = useMemo(() => resolveBodyCompositionMetric(id, label), [id, label]);
  const resolvedTitle = useMemo(
    () => resolveBodyCompositionTitle(metric, typeof label === 'string' ? label : undefined),
    [metric, label]
  );
  const resolvedId = useMemo(() => {
    if (metric?.id) return metric.id;
    if (typeof id === 'string' && id.trim()) return id;
    return slugifyMetric(resolvedTitle);
  }, [metric, id, resolvedTitle]);

  const latestValue = metric?.current.value ?? '--';
  const latestUnit = normalizeUnit(metric?.current.unit);
  const targetValue = metric?.target.value ?? '--';
  const targetUnit = normalizeUnit(metric?.target.unit);
  const targetDate = metric?.targetDate ?? '--';

  const bottomCtaPadding = Math.max(14, insets.bottom + 14);
  const bottomPadding = bottomCtaPadding + CTA_HEIGHT + CTA_TOP_PADDING;
  const headerPaddingTop = insets.top + 12;
  const contentTopPadding = (headerHeight || 0) + 12;

  const { chartData, maxValue } = useExerciseScoreData(selectedFilter);

  const handleHeaderLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    if (nextHeight !== headerHeight) {
      setHeaderHeight(nextHeight);
    }
  };

  const handleUpdateMeasurePress = useCallback(() => {
    router.push({
      pathname: '/body-composition/[id]/update-results',
      params: { id: resolvedId, label: resolvedTitle },
    });
  }, [resolvedId, resolvedTitle, router]);

  const handleFilterSelect = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.safeArea}>
        <ExerciseDetailsHeader
          title={resolvedTitle}
          onBack={() => router.back()}
          paddingTop={headerPaddingTop}
          onLayout={handleHeaderLayout}
          showTabs={false}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: contentTopPadding, paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ExerciseLatestResultCard
            weightValue={latestValue}
            weightUnit={latestUnit}
            metaItems={[
              {
                key: 'target',
                label: 'YOUR TARGET',
                value: targetValue,
                unit: targetUnit,
                flex: 1,
              },
              {
                key: 'date',
                label: 'TARGET DATE',
                value: targetDate,
                flex: 1,
              },
            ]}
          />

          <ExerciseScoreSection
            selectedFilter={selectedFilter}
            onFilterPress={() => setShowFilterModal(true)}
            chartData={chartData}
            maxValue={maxValue}
            unitLabel={latestUnit}
          />
        </ScrollView>

        <ClassDetailsBottomCta
          paddingBottom={bottomCtaPadding}
          disabled={false}
          isCancel={false}
          backgroundColor="#FFFFFF"
          borderColor="#FFFFFF"
          textColor="#000000"
          label="UPDATE MEASURE"
          onPress={handleUpdateMeasurePress}
          buttonStyle={styles.bottomCtaButtonCompact}
          textStyle={styles.bottomCtaTextCompact}
        />

        <ExerciseFilterModal
          visible={showFilterModal}
          selectedFilter={selectedFilter}
          onSelect={handleFilterSelect}
          onClose={() => setShowFilterModal(false)}
        />
      </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  bottomCtaButtonCompact: {
    height: CTA_HEIGHT,
    borderRadius: 8,
  },
  bottomCtaTextCompact: {
    fontSize: typography.size.md,
    letterSpacing: 1.6,
  },
});

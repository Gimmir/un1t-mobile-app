import { ClassDetailsBottomCta } from '@/components/class-details-screen/bottom-cta';
import {
  ExerciseDetailsHeader,
  ExerciseLatestResultCard,
  ExerciseScoreSection,
} from '@/components/exercise-details';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseFilterModal } from './exercise-filter-modal';
import { CTA_HEIGHT, CTA_TOP_PADDING, REP_COUNTS, REP_TABS, type FilterOption } from './exercise-details-data';
import { useExerciseScoreData } from './use-exercise-score-data';

const parseWeight = (weight?: string) => {
  if (!weight || typeof weight !== 'string') {
    return { value: '--', unit: 'KG' };
  }
  const trimmed = weight.trim();
  if (!trimmed) return { value: '--', unit: 'KG' };
  const match = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]+)?/);
  if (!match) return { value: trimmed, unit: '' };
  return { value: match[1], unit: (match[2] ?? 'KG').toUpperCase() };
};

export function ExerciseDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState<'score' | 'tier' | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('Monthly');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { id, name, weight } = useLocalSearchParams<{
    id?: string;
    name?: string;
    weight?: string;
  }>();

  const resolvedName =
    typeof name === 'string' && name.trim().length > 0
      ? name
      : typeof id === 'string'
        ? id.replace(/-/g, ' ')
        : 'Exercise';
  const resolvedExerciseId = useMemo(() => {
    if (typeof id === 'string' && id.trim().length > 0) return id;
    const slug = resolvedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return slug || 'exercise';
  }, [id, resolvedName]);
  const resolvedWeight = useMemo(() => parseWeight(weight), [weight]);
  const bottomCtaPadding = Math.max(14, insets.bottom + 14);
  const bottomPadding = bottomCtaPadding + CTA_HEIGHT + CTA_TOP_PADDING;
  const headerPaddingTop = insets.top + 12;
  const contentTopPadding = (headerHeight || 0) + 12;

  const { chartData, maxValue } = useExerciseScoreData(selectedFilter);

  const handleFilterSelect = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  }, []);

  const handleUpdateResultsPress = useCallback(() => {
    const repCount = REP_COUNTS[activeTab] ?? REP_COUNTS[0];
    router.push({
      pathname: '/exercise-details/[id]/update-results',
      params: { id: resolvedExerciseId, reps: String(repCount), name: resolvedName },
    });
  }, [activeTab, resolvedExerciseId, resolvedName, router]);

  const handleHeaderLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    if (nextHeight !== headerHeight) {
      setHeaderHeight(nextHeight);
    }
  };

  const toggleTooltip = (key: 'score' | 'tier') => {
    setActiveTooltip((current) => (current === key ? null : key));
  };

  const resultMetaItems = useMemo(
    () => [
      {
        key: 'score',
        label: 'YOUR ASSESSMENT SCORE',
        value: '100',
        tooltip: 'Your assessment score is calculated from recent test performance.',
        flex: 2,
      },
      {
        key: 'tier',
        label: 'TIER',
        value: 'T1.',
        tooltip: 'Tier groups your score into a performance level.',
        flex: 1,
      },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.safeArea}>
        <ExerciseDetailsHeader
          title={resolvedName}
          tabs={REP_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onBack={() => router.back()}
          paddingTop={headerPaddingTop}
          onLayout={handleHeaderLayout}
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
            weightValue={resolvedWeight.value}
            weightUnit={resolvedWeight.unit}
            metaItems={resultMetaItems}
            activeTooltip={activeTooltip}
            onToggleTooltip={toggleTooltip}
          />

          <ExerciseScoreSection
            selectedFilter={selectedFilter}
            onFilterPress={() => setShowFilterModal(true)}
            chartData={chartData}
            maxValue={maxValue}
            unitLabel={resolvedWeight.unit}
          />
        </ScrollView>
        <ClassDetailsBottomCta
          paddingBottom={bottomCtaPadding}
          disabled={false}
          isCancel={false}
          backgroundColor="#FFFFFF"
          borderColor="#FFFFFF"
          textColor="#000000"
          label="UPDATE RESULTS"
          onPress={handleUpdateResultsPress}
          buttonStyle={styles.bottomCtaButtonCompact}
          textStyle={styles.bottomCtaTextCompact}
        />

        <ExerciseFilterModal
          visible={showFilterModal}
          selectedFilter={selectedFilter}
          onSelect={handleFilterSelect}
          onClose={() => setShowFilterModal(false)}
        />
        {activeTooltip ? (
          <Pressable
            style={styles.tooltipDismissOverlay}
            onPress={() => setActiveTooltip(null)}
            accessibilityRole="button"
          />
        ) : null}
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
  tooltipDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
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

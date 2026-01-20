import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type ChartDatum = {
  value: number;
  label: string;
  frontColor?: string;
  gradientColor?: string;
};

type ExerciseScoreSectionProps = {
  selectedFilter: string;
  onFilterPress: () => void;
  chartData: ChartDatum[];
  maxValue: number;
  unitLabel?: string;
};

export function ExerciseScoreSection({
  selectedFilter,
  onFilterPress,
  chartData,
  maxValue,
  unitLabel,
}: ExerciseScoreSectionProps) {
  const barSpacing = selectedFilter === 'Yearly' ? 36 : selectedFilter === 'Weekly' ? 24 : 14;
  const resolvedUnit = unitLabel === undefined ? 'KG' : unitLabel.trim().toUpperCase();

  return (
    <>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreTitle}>SCORE</Text>
        <TouchableOpacity style={styles.scoreFilter} onPress={onFilterPress} activeOpacity={0.7}>
          <Text style={styles.scoreFilterText}>{selectedFilter}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            height={160}
            barWidth={20}
            spacing={barSpacing}
            barBorderRadius={6}
            showGradient
            frontColor="#FFFFFF"
            gradientColor="#FFFFFF80"
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={colors.surface.panel}
            noOfSections={4}
            maxValue={maxValue}
            yAxisTextStyle={styles.yAxisText}
            xAxisLabelTextStyle={styles.xAxisLabel}
            hideRules={false}
            rulesColor={colors.surface.panel}
            rulesType="solid"
            isAnimated
            animationDuration={600}
            disablePress={false}
            activeOpacity={0.8}
            renderTooltip={(item: { value: number; label?: string }) => (
              <View style={styles.chartTooltip}>
                <Text style={styles.chartTooltipText}>
                  {item.value}
                  {resolvedUnit ? <Text style={styles.chartTooltipUnit}> {resolvedUnit}</Text> : null}
                </Text>
              </View>
            )}
            scrollToEnd={false}
            disableScroll={false}
            initialSpacing={10}
            endSpacing={10}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scoreTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: 1.5,
  },
  scoreFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  scoreFilterText: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  chartCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    backgroundColor: '#111113',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 28,
    overflow: 'hidden',
  },
  chartContainer: {
    marginLeft: -10,
  },
  yAxisText: {
    color: colors.text.muted,
    fontSize: 10,
  },
  xAxisLabel: {
    color: colors.text.muted,
    fontSize: 10,
    marginTop: 4,
  },
  chartTooltip: {
    backgroundColor: '#1C1C1F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#2C2C2F',
  },
  chartTooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800' as const,
  },
  chartTooltipUnit: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '800' as const,
  },
});

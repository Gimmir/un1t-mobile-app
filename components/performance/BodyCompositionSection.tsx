import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { BodyCompositionCard, BodyCompositionMetric } from './BodyCompositionCard';

type BodyCompositionSectionProps = {
  title: string;
  metrics: BodyCompositionMetric[];
  cardWidth: number;
  onPressMetric?: (metric: BodyCompositionMetric) => void;
};

export function BodyCompositionSection({
  title,
  metrics,
  cardWidth,
  onPressMetric,
}: BodyCompositionSectionProps) {
  return (
    <View style={[styles.section, styles.sectionSpacing, styles.sectionOverflow]}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.compositionScroll}
        contentContainerStyle={styles.compositionList}
        snapToInterval={cardWidth + 12}
        decelerationRate="fast"
      >
        {metrics.map((metric, index) => (
          <BodyCompositionCard
            key={metric.id}
            metric={metric}
            width={cardWidth}
            isLast={index === metrics.length - 1}
            onPress={onPressMetric ? () => onPressMetric(metric) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionSpacing: {
    marginTop: 22,
  },
  sectionLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
    marginLeft: 4,
    marginBottom: 10,
  },
  compositionList: {
    paddingLeft: 16,
    paddingRight: 32,
    overflow: 'visible',
  },
  compositionScroll: {
    marginHorizontal: -16,
    overflow: 'visible',
  },
  sectionOverflow: {
    overflow: 'visible',
  },
});

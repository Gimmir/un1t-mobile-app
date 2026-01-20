import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

export type BodyCompositionMetric = {
  id: string;
  label: string;
  icon: string;
  current: { value: string; unit: string };
  target: { value: string; unit: string };
  detailTitle?: string;
  targetDate?: string;
  helpTitle?: string;
};

type BodyCompositionCardProps = {
  metric: BodyCompositionMetric;
  width: number;
  isLast?: boolean;
  onPress?: () => void;
};

export function BodyCompositionCard({
  metric,
  width,
  isLast = false,
  onPress,
}: BodyCompositionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.compositionCard, { width }, isLast && styles.compositionCardLast]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.compositionHeader}>
        <View style={styles.compositionIconWrap}>
          <MaterialCommunityIcons name="hexagon" size={48} color="#FFFFFF" />
          <View style={styles.compositionIconGlyph}>
            <MaterialCommunityIcons
              name={metric.icon as any}
              size={24}
              color={colors.surface.app}
            />
          </View>
        </View>

        <View style={styles.compositionTitleContainer}>
          <Text style={styles.compositionTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
            {metric.label}
          </Text>
        </View>
      </View>

      <View style={styles.compositionMetaRow}>
        <View style={styles.compositionMetaBlock}>
          <Text style={styles.compositionMetaLabel}>CURRENT</Text>
          <Text style={styles.compositionMetaValue}>
            {metric.current.value}
            <Text style={styles.compositionMetaUnit}>
              {metric.current.unit === '%' ? '' : ' '}
              {metric.current.unit}
            </Text>
          </Text>
        </View>
        <View style={[styles.compositionMetaBlock, styles.compositionMetaRight]}>
          <Text style={styles.compositionMetaLabel}>TARGET</Text>
          <Text style={styles.compositionMetaValue}>
            {metric.target.value}
            <Text style={styles.compositionMetaUnit}>
              {metric.target.unit === '%' ? '' : ' '}
              {metric.target.unit}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compositionCard: {
    minHeight: 190,
    padding: 14,
    marginRight: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
  },
  compositionCardLast: {
    marginRight: 0,
  },
  compositionHeader: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  compositionIconWrap: {
    width: 48,
    height: 48,
  },
  compositionIconGlyph: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compositionTitleContainer: {
    justifyContent: 'flex-end',
  },
  compositionTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  compositionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  compositionMetaBlock: {
    flex: 1,
  },
  compositionMetaRight: {
    alignItems: 'flex-end',
  },
  compositionMetaLabel: {
    color: colors.text.muted,
    fontSize: 10,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  compositionMetaValue: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.2,
  },
  compositionMetaUnit: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
});

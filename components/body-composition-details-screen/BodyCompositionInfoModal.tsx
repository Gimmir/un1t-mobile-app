import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoModalShell } from '@/components/modals/InfoModalShell';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type InfoRange = {
  label: string;
  value: string;
};

type BodyCompositionInfoModalProps = {
  visible: boolean;
  title: string;
  description: string;
  targetRangeTitle?: string;
  targetRangeSubtitle?: string;
  ranges?: InfoRange[];
  onClose: () => void;
};

export function BodyCompositionInfoModal({
  visible,
  title,
  description,
  targetRangeTitle,
  targetRangeSubtitle,
  ranges,
  onClose,
}: BodyCompositionInfoModalProps) {
  const hasTargetRange = Boolean(targetRangeTitle || targetRangeSubtitle);
  const hasRanges = Boolean(ranges && ranges.length > 0);

  return (
    <InfoModalShell visible={visible} title={title} onClose={onClose}>
      <Text style={styles.sectionLabel}>DESCRIPTION</Text>
      <Text style={styles.descriptionText}>{description}</Text>

      {hasTargetRange || hasRanges ? <View style={styles.sectionDivider} /> : null}

      {hasTargetRange ? (
        <View style={styles.targetRangeRow}>
          <View style={styles.targetIconWrap}>
            <MaterialCommunityIcons name="hexagon" size={68} color="#FFFFFF" />
            <View style={styles.targetIconGlyph}>
              <MaterialCommunityIcons name="account" size={28} color={colors.surface.base} />
            </View>
          </View>
          <View style={styles.targetRangeText}>
            {targetRangeTitle ? <Text style={styles.targetRangeLabel}>{targetRangeTitle}</Text> : null}
            {targetRangeSubtitle ? (
              <Text style={styles.targetRangeValue}>{targetRangeSubtitle}</Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {hasTargetRange && hasRanges ? <View style={styles.sectionDivider} /> : null}

      {hasRanges ? (
        <View style={styles.rangeRow}>
          {(ranges ?? []).map((range) => (
            <View key={range.label} style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>{range.label}</Text>
              <Text style={styles.rangeValue}>{range.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </InfoModalShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
  },
  descriptionText: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    lineHeight: 20,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surface.panel,
  },
  targetRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  targetIconWrap: {
    width: 68,
    height: 68,
  },
  targetIconGlyph: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetRangeText: {
    flex: 1,
  },
  targetRangeLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  targetRangeValue: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rangeItem: {
    flex: 1,
  },
  rangeLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  rangeValue: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
  },
});

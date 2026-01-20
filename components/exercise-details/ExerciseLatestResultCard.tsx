import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type TooltipKey = string;

type ResultMetaItem = {
  key: string;
  label: string;
  value: string;
  unit?: string;
  tooltip?: string;
  flex?: number;
};

type ExerciseLatestResultCardProps = {
  weightValue: string;
  weightUnit: string;
  metaItems: ResultMetaItem[];
  activeTooltip?: TooltipKey | null;
  onToggleTooltip?: (key: TooltipKey) => void;
  resultLabel?: string;
};

export function ExerciseLatestResultCard({
  weightValue,
  weightUnit,
  metaItems,
  activeTooltip,
  onToggleTooltip,
  resultLabel = 'LATEST RESULT',
}: ExerciseLatestResultCardProps) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultLabel}>{resultLabel}</Text>
      <View style={styles.resultValueRow}>
        <Text style={styles.resultValue}>{weightValue}</Text>
        {weightUnit ? <Text style={styles.resultUnit}>{weightUnit}</Text> : null}
      </View>
      <View style={styles.resultDivider} />
      <View style={styles.resultMetaRow}>
        {metaItems.map((item, index) => {
          const hasTooltip = Boolean(item.tooltip && onToggleTooltip);
          const showTooltip = Boolean(item.tooltip && activeTooltip === item.key);
          const tooltipStyle = index === 0 ? styles.tooltipLeft : styles.tooltipRight;
          return (
            <React.Fragment key={item.key}>
              <View style={[styles.resultMetaBlock, { flex: item.flex ?? 1 }]}>
                <View style={styles.resultMetaHeader}>
                  <Text style={styles.resultMetaLabel} numberOfLines={1} ellipsizeMode="tail">
                    {item.label}
                  </Text>
                  {hasTooltip ? (
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => onToggleTooltip(item.key)}
                      accessibilityRole="button"
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="information-circle-outline" size={16} color={colors.text.muted} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {showTooltip ? (
                  <View style={[styles.tooltip, tooltipStyle]}>
                    <Text style={styles.tooltipText}>{item.tooltip}</Text>
                  </View>
                ) : null}
                <Text style={styles.resultMetaValue}>
                  {item.value}
                  {item.unit ? <Text style={styles.resultMetaUnit}> {item.unit}</Text> : null}
                </Text>
              </View>
              {index < metaItems.length - 1 ? <View style={styles.resultMetaDivider} /> : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    backgroundColor: '#111113',
    paddingVertical: 28,
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  resultLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultValueRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 22,
    paddingVertical: 0,
  },
  resultValue: {
    color: '#FFFFFF',
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  resultUnit: {
    color: colors.text.secondary,
    fontSize: typography.size.xl,
    marginLeft: 8,
    marginBottom: 0,
    letterSpacing: 1.2,
  },
  resultDivider: {
    height: 1,
    backgroundColor: colors.surface.panel,
    marginBottom: 20,
  },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  resultMetaBlock: {
    flex: 1,
    position: 'relative',
  },
  resultMetaDivider: {
    width: 1,
    backgroundColor: colors.surface.panel,
    marginHorizontal: 16,
  },
  resultMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: 10,
  },
  resultMetaLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  infoButton: {
    marginLeft: 6,
    flexShrink: 0,
  },
  resultMetaValue: {
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    lineHeight: 28,
    letterSpacing: 0.6,
  },
  resultMetaUnit: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.4,
  },
  tooltip: {
    position: 'absolute',
    top: 22,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    backgroundColor: '#111113',
    maxWidth: 160,
    zIndex: 2,
  },
  tooltipLeft: {
    left: 0,
  },
  tooltipRight: {
    right: 0,
  },
  tooltipText: {
    color: '#E4E4E7',
    fontSize: typography.size.xs,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});

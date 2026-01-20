import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function SettingsRow(props: { label: string; value: string; onPress: () => void; isLast?: boolean }) {
  const { label, value, onPress, isLast } = props;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.row, isLast ? styles.rowLast : null]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </TouchableOpacity>
  );
}

export function SettingsToggleRow(props: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { title, subtitle, value, onValueChange } = props;

  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 16,
  },
  rowLast: {
    paddingBottom: 16,
  },
  rowLabel: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.3,
  },
  rowValue: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleText: {
    flex: 1,
    paddingRight: 8,
  },
  toggleTitle: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  toggleSubtitle: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    lineHeight: 16,
  },
  toggleSwitchWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function ProfileRow(props: {
  label: string;
  icon: string;
  isLast?: boolean;
  onPress?: () => void;
  switchValue?: boolean;
  onToggle?: (value: boolean) => void;
  accentColor?: string;
}) {
  const { label, icon, isLast, onPress, switchValue, onToggle, accentColor } = props;
  const isSwitch = typeof switchValue === 'boolean' && typeof onToggle === 'function';

  const content = (
    <>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={18} color={accentColor ?? '#E4E4E7'} style={{ width: 22 }} />
        <Text style={[styles.rowLabel, accentColor ? { color: accentColor } : null]}>{label}</Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={ colors.text.muted } />
      )}
    </>
  );

  if (isSwitch) {
    return <View style={[styles.row, isLast ? styles.rowLast : null]}>{content}</View>;
  }

  if (!onPress) {
    return <View style={[styles.row, isLast ? styles.rowLast : null]}>{content}</View>;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.row, isLast ? styles.rowLast : null]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.5,
  },
});
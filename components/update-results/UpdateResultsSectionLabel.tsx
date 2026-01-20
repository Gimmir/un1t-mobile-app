import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type UpdateResultsSectionLabelProps = {
  children: string;
  align?: 'left' | 'center';
  style?: StyleProp<TextStyle>;
};

export function UpdateResultsSectionLabel({
  children,
  align = 'left',
  style,
}: UpdateResultsSectionLabelProps) {
  return (
    <Text style={[styles.label, align === 'center' && styles.centered, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  centered: {
    textAlign: 'center',
  },
});

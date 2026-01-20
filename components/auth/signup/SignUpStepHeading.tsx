import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function SignUpStepHeading(props: { title: string; subtitle?: string }) {
  const { title, subtitle } = props;
  return (
    <>
      <Text style={[styles.title, !subtitle && styles.titleOnly]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 6,
  },
  titleOnly: {
    marginBottom: 16,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
});
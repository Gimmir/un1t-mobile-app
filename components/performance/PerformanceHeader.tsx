import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';

type PerformanceHeaderProps = {
  title?: string;
};

export function PerformanceHeader({ title = 'PERFORMANCE' }: PerformanceHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    fontSize: typography.size.xl,
    letterSpacing: 2,
  },
});

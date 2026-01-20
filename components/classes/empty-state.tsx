import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No classes available for this date</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text.muted,
  },
});
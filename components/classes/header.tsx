import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>CLASSES</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

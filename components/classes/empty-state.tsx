import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
});

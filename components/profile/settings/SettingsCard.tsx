import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export function SettingsCard(props: { children: ReactNode; style?: ViewStyle }) {
  const { children, style } = props;
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    marginHorizontal: 16,
  },
});


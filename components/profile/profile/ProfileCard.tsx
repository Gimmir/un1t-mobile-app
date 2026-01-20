import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export function ProfileCard(props: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
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
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});

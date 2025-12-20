import React from 'react';
import { StyleSheet, View } from 'react-native';

export function SettingsDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1F1F23',
    marginHorizontal: 16,
  },
});


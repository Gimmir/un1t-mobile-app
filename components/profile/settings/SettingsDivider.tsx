import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme/colors';

export function SettingsDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surface.elevated,
    marginHorizontal: 16,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function ProfileVersionBlock(props: { version: string; company: string }) {
  const { version, company } = props;
  return (
    <View style={styles.versionBlock}>
      <Text style={styles.versionText}>{version}</Text>
      <Text style={styles.versionText}>{company}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  versionBlock: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    letterSpacing: 1,
  },
});
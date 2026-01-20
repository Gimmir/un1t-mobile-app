import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function SettingsHeader(props: { title: string; onBack: () => void }) {
  const { title, onBack } = props;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={onBack}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  backButton: {
    width: 72,
    height: 40,
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 72,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
});
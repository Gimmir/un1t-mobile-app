import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';

type UpdateResultsHeaderProps = {
  title: string;
  onClose: () => void;
  topInset?: number;
};

export function UpdateResultsHeader({
  title,
  onClose,
  topInset = 0,
}: UpdateResultsHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 6 }]}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={onClose}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
});

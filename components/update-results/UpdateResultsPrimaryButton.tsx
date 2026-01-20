import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { typography } from '@/src/theme/typography';

type UpdateResultsPrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function UpdateResultsPrimaryButton({
  label,
  onPress,
}: UpdateResultsPrimaryButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.9}
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

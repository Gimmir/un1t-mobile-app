import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type UpdateResultsDateCardProps = {
  value: string;
  onPress: () => void;
};

export function UpdateResultsDateCard({ value, onPress }: UpdateResultsDateCardProps) {
  return (
    <TouchableOpacity style={styles.dateCard} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.dateText}>{value}</Text>
      <MaterialCommunityIcons name="calendar-blank" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.6,
  },
});

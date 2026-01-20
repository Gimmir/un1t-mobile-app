import { SlideUpModal } from '@/components/auth';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FILTER_DATA, type FilterOption } from './exercise-details-data';

type ExerciseFilterModalProps = {
  visible: boolean;
  selectedFilter: FilterOption;
  onSelect: (filter: FilterOption) => void;
  onClose: () => void;
};

export function ExerciseFilterModal({
  visible,
  selectedFilter,
  onSelect,
  onClose,
}: ExerciseFilterModalProps) {
  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title="Period"
      data={FILTER_DATA}
      renderItem={({ item }: { item: { id: FilterOption; label: string } }) => {
        const isSelected = selectedFilter === item.id;
        return (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => onSelect(item.id)}
            style={[styles.filterModalRow, isSelected && styles.filterModalRowSelected]}
          >
            <Text style={[styles.filterModalText, isSelected && styles.filterModalTextSelected]}>
              {item.label}
            </Text>
            {isSelected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  filterModalRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  filterModalRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  filterModalText: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.4,
  },
  filterModalTextSelected: {
    color: '#FFFFFF',
  },
});

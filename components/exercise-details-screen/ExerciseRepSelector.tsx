import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type ExerciseRepSelectorProps<T extends number> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function ExerciseRepSelector<T extends number>({
  options,
  value,
  onChange,
}: ExerciseRepSelectorProps<T>) {
  return (
    <View style={styles.repSelector}>
      {options.map((option, index) => {
        const isActive = option === value;
        return (
          <React.Fragment key={option}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={() => onChange(option)}
              style={[styles.repOption, isActive && styles.repOptionActive]}
            >
              <Text style={[styles.repOptionText, isActive && styles.repOptionTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
            {index < options.length - 1 ? <View style={styles.repOptionDivider} /> : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  repSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1C1C1F',
    borderRadius: 8,
    backgroundColor: '#111113',
    padding: 2,
    overflow: 'hidden',
    marginBottom: 18,
  },
  repOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  repOptionActive: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#1C1C1F',
  },
  repOptionDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#1C1C1F',
    marginVertical: 8,
  },
  repOptionText: {
    color: colors.text.muted,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  repOptionTextActive: {
    color: '#FFFFFF',
  },
});

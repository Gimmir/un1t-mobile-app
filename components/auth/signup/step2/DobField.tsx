import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

function formatDate(date?: Date) {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DobField<T extends { dob: Date }>(props: {
  control: Control<T>;
  onOpen: () => void;
  errorText?: string;
}) {
  const { control, onOpen, errorText } = props;

  return (
    <Controller
      control={control}
      name={'dob' as any}
      render={({ field: { value } }) => (
        <View>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={onOpen}
            style={[styles.selectField, errorText ? styles.selectFieldError : null]}
          >
            <Text style={[styles.selectValue, value ? null : styles.selectPlaceholder]}>
              {value ? formatDate(value) : 'DOB (DD/MM/YYYY)'}
            </Text>
            <IconSymbol name="chevron.down" size={18} color={ colors.text.muted } />
          </TouchableOpacity>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  selectField: {
    height: 52,
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectFieldError: {
    borderColor: '#EF4444',
  },
  selectValue: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    flex: 1,
  },
  selectPlaceholder: {
    color: colors.text.muted,
  },
  errorText: {
    color: '#EF4444',
    fontSize: typography.size.sm,
    marginTop: 6,
    marginLeft: 6,
    fontWeight: typography.weight.semibold,
  },
});
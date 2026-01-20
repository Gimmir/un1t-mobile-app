import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { DetailRow, FormKey, FormValues } from './types';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function DetailRowItem(props: {
  row: DetailRow;
  index: number;
  isLast: boolean;
  isEditing: boolean;
  formValues: FormValues;
  onChange: (key: FormKey, value: string) => void;
  onDobPress: () => void;
  onCountryPress: () => void;
}) {
  const { row, isLast, isEditing, formValues, onChange, onDobPress, onCountryPress } = props;

  const formKey = row.formKey;
  const rawRowValue = typeof row.value === 'string' ? row.value : '';
  const trimmedValue = rawRowValue.trim();
  const isValueMissing = trimmedValue.length === 0;
  const viewValue = isValueMissing ? 'N/A' : row.value;
  const pickerValue = isValueMissing ? row.placeholder ?? 'Select' : row.value;
  const isEditingMultiline = Boolean(isEditing && formKey && !row.isDate && !row.isCountry && row.multiline);

  return (
    <View style={[styles.row, isEditingMultiline && styles.rowMultiline, isLast && styles.rowLast]}>
      <Text style={styles.rowLabel}>{row.label}</Text>
      {isEditing && formKey ? (
        row.isDate ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            style={styles.pickerButton}
            onPress={onDobPress}
            hitSlop={8}
          >
            <Text style={[styles.pickerText, isValueMissing && styles.pickerPlaceholder]}>
              {pickerValue}
            </Text>
          </TouchableOpacity>
        ) : row.isCountry ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            style={styles.pickerButton}
            onPress={onCountryPress}
            hitSlop={8}
          >
            <Text style={[styles.pickerText, isValueMissing && styles.pickerPlaceholder]}>
              {pickerValue}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[
              styles.input,
              row.multiline ? styles.inputMultiline : undefined,
            ]}
            value={formValues[formKey] ?? ''}
            onChangeText={(text) => onChange(formKey, text)}
            placeholder={row.placeholder}
            placeholderTextColor={ colors.text.placeholder }
            keyboardType={row.keyboardType}
            autoCapitalize={row.autoCapitalize ?? 'none'}
            multiline={row.multiline}
            autoComplete={row.autoComplete}
            textContentType={row.textContentType}
            underlineColorAndroid="transparent"
          />
        )
      ) : (
        <Text
          style={[styles.rowValue, isValueMissing && styles.rowValueMissing]}
          numberOfLines={row.valueNumberOfLines ?? 1}
          ellipsizeMode={row.valueEllipsizeMode ?? 'tail'}
        >
          {viewValue}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
    gap: 16,
  },
  rowMultiline: {
    alignItems: 'flex-start',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    flexShrink: 1,
    maxWidth: '45%',
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.3,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
  },
  rowValueMissing: {
    color: '#F87171',
  },
  input: {
    flex: 1,
    textAlign: 'right',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputMultiline: {
    minHeight: 64,
    textAlign: 'left',
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  pickerButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pickerText: {
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
  },
  pickerPlaceholder: {
    color: colors.text.muted,
  },
});
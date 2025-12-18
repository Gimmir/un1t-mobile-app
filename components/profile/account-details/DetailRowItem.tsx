import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { DetailRow, FormKey, FormValues } from './types';

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
  const displayValue = isValueMissing ? 'N/A' : row.value;

  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Text style={styles.rowLabel}>{row.label}</Text>
      {isEditing && formKey ? (
        row.isDate ? (
          <TouchableOpacity style={styles.actionButton} onPress={onDobPress}>
            <Text style={[styles.rowValue, isValueMissing && styles.rowValueMissing]}>
              {displayValue}
            </Text>
          </TouchableOpacity>
        ) : row.isCountry ? (
          <TouchableOpacity style={styles.actionButton} onPress={onCountryPress}>
            <Text style={[styles.rowValue, isValueMissing && styles.rowValueMissing]}>
              {displayValue}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[styles.input, row.multiline ? styles.inputMultiline : undefined]}
            value={formValues[formKey] ?? ''}
            onChangeText={(text) => onChange(formKey, text)}
            placeholder={row.placeholder}
            placeholderTextColor="#52525B"
            keyboardType={row.keyboardType}
            autoCapitalize={row.autoCapitalize ?? 'none'}
            multiline={row.multiline}
            autoComplete={row.autoComplete}
            textContentType={row.textContentType}
          />
        )
      ) : (
        <Text
          style={[styles.rowValue, isValueMissing && styles.rowValueMissing]}
          numberOfLines={row.valueNumberOfLines ?? 1}
          ellipsizeMode={row.valueEllipsizeMode ?? 'tail'}
        >
          {displayValue}
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
    borderBottomColor: '#2A2A2E',
    gap: 16,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  rowValueMissing: {
    color: '#F87171',
  },
  input: {
    flex: 1,
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingVertical: 4,
  },
  inputMultiline: {
    minHeight: 48,
    textAlignVertical: 'center',
  },
  actionButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
});


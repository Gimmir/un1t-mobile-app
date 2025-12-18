import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DetailSection, FormKey, FormValues } from './types';
import { DetailRowItem } from './DetailRowItem';

export function DetailSectionCard(props: {
  section: DetailSection;
  isEditing: boolean;
  formValues: FormValues;
  onChange: (key: FormKey, value: string) => void;
  onDobPress: () => void;
  onCountryPress: () => void;
}) {
  const { section, isEditing, formValues, onChange, onDobPress, onCountryPress } = props;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.card}>
        {section.rows.map((row, index) => (
          <DetailRowItem
            key={row.key}
            row={row}
            index={index}
            isLast={index === section.rows.length - 1}
            isEditing={isEditing}
            formValues={formValues}
            onChange={onChange}
            onDobPress={onDobPress}
            onCountryPress={onCountryPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#1B1B1D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2E',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});


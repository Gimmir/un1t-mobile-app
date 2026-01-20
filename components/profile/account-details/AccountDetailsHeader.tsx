import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function AccountDetailsHeader(props: {
  title: string;
  isEditing: boolean;
  canEdit: boolean;
  isSaving: boolean;
  onBack: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  const { title, isEditing, canEdit, isSaving, onBack, onCancel, onEdit, onSave } = props;

  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {isEditing ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={onCancel}
            style={styles.editButton}
          >
            <Text style={styles.editText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={[styles.headerSide, styles.headerSideRight]}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={isEditing ? onSave : onEdit}
          style={styles.editButton}
          disabled={!canEdit || (isEditing && isSaving)}
        >
          <Text
            style={[
              styles.editText,
              (!canEdit || (isEditing && isSaving)) ? styles.editTextDisabled : undefined,
            ]}
          >
            {isEditing ? (isSaving ? 'Saving…' : 'Save') : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const HEADER_SIDE_WIDTH = 72;

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
  headerSide: {
    width: HEADER_SIDE_WIDTH,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  backButton: {
    height: 40,
    justifyContent: 'center',
  },
  editButton: {
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.3,
  },
  editTextDisabled: {
    color: colors.text.secondary,
  },
});
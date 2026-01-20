import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export type ContactOption = {
  id: string;
  name: string;
  phone: string;
  initial: string;
};

export function ContactRow(props: { contact: ContactOption; onPress: () => void }) {
  const { contact, onPress } = props;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.row}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{contact.initial}</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={styles.phone} numberOfLines={1}>
          {contact.phone}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color={ colors.text.muted } />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
  },
  text: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.2,
  },
  phone: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginTop: 4,
  },
});
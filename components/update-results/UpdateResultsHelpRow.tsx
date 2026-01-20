import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type UpdateResultsHelpRowProps = {
  text: string;
  onPress: () => void;
};

export function UpdateResultsHelpRow({ text, onPress }: UpdateResultsHelpRowProps) {
  return (
    <TouchableOpacity style={styles.helpRow} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.helpIcon}>
        <MaterialCommunityIcons name="hexagon-outline" size={36} color="#FFFFFF" />
        <Text style={styles.helpIconText}>?</Text>
      </View>
      <Text style={styles.helpText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  helpRow: {
    marginTop: 'auto',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surface.panel,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  helpIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIconText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});

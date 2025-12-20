import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export function ClassDetailsTopBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onBack}
        activeOpacity={0.8}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.topTitle}>BOOK CLASS</Text>
      <View style={styles.topBarSpacer} />
    </View>
  );
}


import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function SignUpTopBar(props: { onBack: () => void }) {
  const { onBack } = props;
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
});

export function SignUpTitles() {
  return (
    <View style={titleStyles.header}>
      <View style={titleStyles.headerInner}>
        <Text style={titleStyles.headerTitle}>{`Let's get\nstarted`}</Text>
      </View>
    </View>
  );
}

const titleStyles = StyleSheet.create({
  header: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  headerInner: {
    width: '100%',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: 0.1,
  },
});

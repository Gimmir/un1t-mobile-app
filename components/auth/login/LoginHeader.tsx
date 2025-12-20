import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function LoginTopBar(props: { onBack: () => void }) {
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

export function LoginTitles(props: { largeOpacity: Animated.Value; smallOpacity: Animated.Value }) {
  const { largeOpacity, smallOpacity } = props;

  return (
    <View style={titleStyles.header}>
      <Animated.View style={[titleStyles.headerInner, { opacity: largeOpacity }]}>
        <Text style={titleStyles.headerTitle}>{`Hey,\nWelcome\nBack`}</Text>
      </Animated.View>

      <Animated.View style={[titleStyles.smallHeaderContainer, { opacity: smallOpacity }]}>
        <Text style={titleStyles.smallHeaderTitle}>LOGIN</Text>
      </Animated.View>
    </View>
  );
}

const titleStyles = StyleSheet.create({
  header: {
    paddingTop: 14,
    paddingBottom: 16,
    position: 'relative',
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
  smallHeaderContainer: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    width: '100%',
  },
  smallHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

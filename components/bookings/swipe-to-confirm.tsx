import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

type SwipeToConfirmProps = {
  onConfirm: () => void;
  disabled?: boolean;
  label?: string;
};

const HANDLE_SIZE = 52;
const HORIZONTAL_PADDING = 6;

export function SwipeToConfirm({ onConfirm, disabled, label = 'Swipe to confirm' }: SwipeToConfirmProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  const [didConfirm, setDidConfirm] = useState(false);

  const maxTranslateX = useMemo(() => {
    const width = Math.max(0, trackWidth - HANDLE_SIZE - HORIZONTAL_PADDING);
    return width;
  }, [trackWidth]);

  const reset = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start();
  }, [translateX]);

  const confirm = useCallback(() => {
    setDidConfirm(true);
    Animated.timing(translateX, {
      toValue: maxTranslateX,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      onConfirm();
    });
  }, [maxTranslateX, onConfirm, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled && !didConfirm,
        onMoveShouldSetPanResponder: (_, gesture) =>
          !disabled && !didConfirm && Math.abs(gesture.dx) > 4,
        onPanResponderMove: (_, gesture) => {
          if (disabled || didConfirm) return;
          const nextX = Math.max(0, Math.min(maxTranslateX, gesture.dx));
          translateX.setValue(nextX);
        },
        onPanResponderRelease: (_, gesture) => {
          if (disabled || didConfirm) return;
          const threshold = maxTranslateX * 0.82;
          if (gesture.dx >= threshold && maxTranslateX > 0) {
            confirm();
          } else {
            reset();
          }
        },
        onPanResponderTerminate: () => {
          if (disabled || didConfirm) return;
          reset();
        },
      }),
    [confirm, didConfirm, disabled, maxTranslateX, reset, translateX]
  );

  return (
    <View
      style={[styles.track, disabled && styles.trackDisabled]}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
    >
      <Text style={[styles.trackLabel, disabled && styles.trackLabelDisabled]} numberOfLines={1}>
        {didConfirm ? 'Confirmed' : label}
      </Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.handle,
          disabled && styles.handleDisabled,
          { transform: [{ translateX }] },
        ]}
      >
        <Text style={styles.handleArrow}>››</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackDisabled: {
    opacity: 0.7,
  },
  trackLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingHorizontal: HANDLE_SIZE + 6,
  },
  trackLabelDisabled: {
    color: colors.text.muted,
  },
  handle: {
    position: 'absolute',
    left: HORIZONTAL_PADDING,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleDisabled: {
    backgroundColor: '#E4E4E7',
  },
  handleArrow: {
    color: '#0A0A0A',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
});

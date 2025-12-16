import { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface PulsatingCardProps {
  children: ReactNode;
  onPress: () => void;
}

export function PulsatingCard({ children, onPress }: PulsatingCardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
        {
          iterations: -1,
        }
      ).start();
    };
    pulse();
    return () => animatedValue.stopAnimation();
  }, [animatedValue]);

  const shadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  const shadowRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.card,
          {
            shadowColor: 'white',
            shadowOpacity: shadowOpacity,
            shadowRadius: shadowRadius,
            elevation: 3,
            borderColor: 'rgba(255, 255, 255, 0.05)',
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#202020',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginHorizontal: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
});

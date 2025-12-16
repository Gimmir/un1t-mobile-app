import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AnimatedDotProps {
  isActive: boolean;
}

function AnimatedDot({ isActive }: AnimatedDotProps) {
  const animation = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive, animation]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 24],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3f3f46', 'white'],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: width,
          backgroundColor: backgroundColor,
        },
      ]}
    />
  );
}

interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

export function PaginationDots({ count, activeIndex }: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <AnimatedDot key={index} isActive={index === activeIndex} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#3f3f46',
  },
});

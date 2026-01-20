import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface ProgressDotsProps {
  currentStep: number; // Поточний крок (1, 2, 3, 4, 5)
  totalSteps?: number; // Загальна кількість (за замовчуванням 5)
}

export function ProgressDots({ currentStep, totalSteps = 5 }: ProgressDotsProps) {
  return (
    <View className="flex-row gap-1.5 items-center absolute left-0 right-0 justify-center pointer-events-none">
      {Array.from({ length: totalSteps }).map((_, index) => {
        // Логіка для визначення стану
        // index починається з 0, тому Step 1 це index 0.
        const isActive = index === currentStep - 1;
        const isDone = index < currentStep - 1;

        return (
          <AnimatedDot 
            key={index} 
            isActive={isActive} 
            isDone={isDone} 
          />
        );
      })}
    </View>
  );
}

function AnimatedDot({ isActive, isDone }: { isActive: boolean; isDone: boolean }) {
  // ПОЧАТКОВІ ЗНАЧЕННЯ:
  // Ширина завжди починається з 6 (маленька крапка).
  // Це гарантує, що при переході на новий екран ми побачимо, як вона росте.
  const widthAnim = useRef(new Animated.Value(6)).current;
  
  // Колір: якщо пройдено — відразу білий, якщо ні — сірий.
  const colorAnim = useRef(new Animated.Value(isDone ? 1 : 0)).current;

  useEffect(() => {
    // ЦІЛЬОВІ ЗНАЧЕННЯ:
    const targetWidth = isActive ? 32 : 6; // 32px (w-8) для активної
    const targetColor = (isActive || isDone) ? 1 : 0; // 1 = білий

    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: targetWidth,
        duration: 400, // Трохи повільніше для помітності (400мс)
        easing: Easing.out(Easing.back(1.5)), // Ефект пружини для "секусуальності"
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: targetColor,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, isDone, widthAnim, colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#52525b', '#ffffff'] // zinc-600 -> white
  });

  return (
    <Animated.View
      style={{
        width: widthAnim,
        height: 4,
        borderRadius: 9999,
        backgroundColor: backgroundColor,
      }}
    />
  );
}

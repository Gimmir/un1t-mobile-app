import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  // --- Анімаційні змінні ---
  const animationPhase = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Запускаємо анімацію
    animationPhase.value = withSequence(
      withDelay(300, withSpring(1, { damping: 12 }))
    );

    // Перехід до фази контенту через 2 секунди
    const timeout = setTimeout(() => {
      animationPhase.value = withTiming(2, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      contentOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // --- Стилі анімації ---
  const logoAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationPhase.value,
      [0, 1, 2],
      [0, 0, -height * 0.15],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      animationPhase.value,
      [0, 1, 2],
      [0.5, 1, 0.7]
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        {
          translateY: interpolate(
            contentOpacity.value,
            [0, 1],
            [50, 0]
          ),
        },
      ],
    };
  });

  // --- Навігація ---
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <View className="flex-1 bg-white items-center justify-center relative">
      <StatusBar style="dark" />

      {/* --- Анімоване Лого --- */}
      <Animated.View style={[logoAnimatedStyle]} className="items-center z-10">
        <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center shadow-lg shadow-blue-100 border border-slate-100">
           {/* Переконайся, що шлях до картинки правильний */}
           <Image 
             source={require('../assets/images/react-logo.png')}
             className="w-20 h-20"
             resizeMode="contain"
           />
        </View>
        <Text className="text-3xl font-bold text-slate-900 mt-6 tracking-tight">
          Un1t App
        </Text>
      </Animated.View>

      {/* --- Кнопки (з'являються пізніше) --- */}
      <Animated.View 
        style={[contentAnimatedStyle]} 
        className="absolute bottom-12 w-full px-6 items-center"
      >
        <Text className="text-slate-500 text-center mb-8 text-lg px-4 leading-relaxed">
          Керуйте своїм бізнесом та замовленнями в одному зручному додатку.
        </Text>

        {/* Кнопка Реєстрації */}
        <TouchableOpacity 
          onPress={handleSignUp}
          activeOpacity={0.8}
          className="w-full bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200 mb-4"
        >
          <Text className="text-white font-bold text-lg">
            Створити акаунт
          </Text>
        </TouchableOpacity>

        {/* Кнопка Входу */}
        <TouchableOpacity 
          onPress={handleLogin}
          activeOpacity={0.7}
          className="w-full bg-slate-50 py-4 rounded-2xl items-center border border-slate-200"
        >
          <Text className="text-slate-900 font-semibold text-lg">
            Увійти
          </Text>
        </TouchableOpacity>

        <Text className="text-slate-300 text-xs mt-6 text-center">
          v1.0.0 Alpha
        </Text>
      </Animated.View>
    </View>
  );
}
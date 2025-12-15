import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // За замовчуванням ховаємо шапку
        animation: 'slide_from_right', // Анімація переходу
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="sign-up" 
        options={{ 
          headerShown: true, 
          title: 'Реєстрація',
          headerBackTitle: 'Назад',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' }
        }} 
      />
    </Stack>
  );
}
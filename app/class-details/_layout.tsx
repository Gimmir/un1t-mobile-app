import { Stack } from 'expo-router';
import React from 'react';

export default function ClassDetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    />
  );
}


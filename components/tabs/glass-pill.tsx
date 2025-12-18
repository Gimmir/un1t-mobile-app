import { BlurView } from 'expo-blur';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { glassTint, isAndroid } from './constants';
import { styles } from './styles';

interface GlassPillProps {
  children: React.ReactNode;
  isPill: boolean;
  style?: StyleProp<ViewStyle>;
}

export const GlassPill: React.FC<GlassPillProps> = ({ children, isPill, style }) => {
  const containerStyle = isPill ? styles.pillShape : styles.circleShape;
  const baseStyle = isAndroid ? styles.androidFallback : styles.blurBase;
  const contentStyle = isPill ? styles.contentRow : styles.contentCenter;

  if (isAndroid) {
    return (
      <View style={[containerStyle, baseStyle, style]}>
        <View style={contentStyle}>{children}</View>
      </View>
    );
  }

  return (
    <BlurView intensity={100} tint={glassTint} style={[containerStyle, baseStyle, style]}>
      <View style={contentStyle}>{children}</View>
    </BlurView>
  );
};

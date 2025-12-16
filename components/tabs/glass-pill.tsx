import { BlurView } from 'expo-blur';
import React from 'react';
import { View } from 'react-native';
import { glassTint, isAndroid } from './constants';
import { styles } from './styles';

interface GlassPillProps {
  children: React.ReactNode;
  isPill: boolean;
}

export const GlassPill: React.FC<GlassPillProps> = ({ children, isPill }) => {
  const containerStyle = isPill ? styles.pillShape : styles.circleShape;
  const baseStyle = isAndroid ? styles.androidFallback : styles.blurBase;
  const contentStyle = isPill ? styles.contentRow : styles.contentCenter;

  if (isAndroid) {
    return (
      <View style={[containerStyle, baseStyle]}>
        <View style={contentStyle}>{children}</View>
      </View>
    );
  }

  return (
    <BlurView intensity={100} tint={glassTint} style={[containerStyle, baseStyle]}>
      <View style={contentStyle}>{children}</View>
    </BlurView>
  );
};

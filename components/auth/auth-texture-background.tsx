import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme/colors';

export function AuthTextureBackground(props: { height?: number }) {
  const { height = 520 } = props;

  return (
    <View style={[styles.hero, { height }]}>
      <Image
        source={require('@/assets/images/home-top-texture.png')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(25,25,25,0.10)', 'rgba(25,25,25,0.70)', colors.surface.app]}
        locations={[0, 0.55, 1]}
        style={styles.heroOverlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

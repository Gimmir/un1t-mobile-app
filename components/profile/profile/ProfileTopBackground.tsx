import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme/colors';

export function ProfileTopBackground() {
  return (
    <View style={styles.textureWrapper}>
      <Image
        source={require('@/assets/images/home-top-texture.png')}
        style={styles.textureImage}
        resizeMode="cover"
      />
      <LinearGradient colors={['rgba(0,0,0,0)', colors.surface.app]} style={styles.textureOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  textureWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  textureImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  textureOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
  },
});

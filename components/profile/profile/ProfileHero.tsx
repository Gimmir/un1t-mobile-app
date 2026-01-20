import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function ProfileHero(props: { fullName: string; studioLocation: string }) {
  const { fullName, studioLocation } = props;

  return (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>{fullName}</Text>
      <Text style={styles.heroSubtitle}>
        STUDIO <Text style={styles.heroSubtitleAccent}>{studioLocation}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.heavy,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    letterSpacing: 3,
    color: colors.text.secondary,
    marginTop: 6,
  },
  heroSubtitleAccent: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    letterSpacing: 3,
  },
});
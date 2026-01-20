import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

interface HomeHeroProps {
  title: string;
  subtitle: React.ReactNode;
  isLoading?: boolean;
}

export function HomeHero({ title, subtitle, isLoading }: HomeHeroProps) {
  return (
    <View style={styles.hero}>
      {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.heroTitle}>{title}</Text>}
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    fontSize: typography.size.xl,
    letterSpacing: 2,
  },
  heroSubtitle: {
    color: colors.text.secondary,
    marginTop: 6,
    letterSpacing: 1,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
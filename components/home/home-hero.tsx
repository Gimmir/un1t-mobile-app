import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

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
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 2,
  },
  heroSubtitle: {
    color: '#A1A1AA',
    marginTop: 6,
    letterSpacing: 1,
    fontSize: 12,
  },
});


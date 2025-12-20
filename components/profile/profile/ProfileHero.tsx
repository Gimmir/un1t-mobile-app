import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#D4D4D8',
    marginTop: 6,
  },
  heroSubtitleAccent: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 3,
  },
});


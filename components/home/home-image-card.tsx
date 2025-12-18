import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonIcon } from './hexagon-icon';

interface HomeImageCardProps {
  imageUri: string;
  title: string;
  metaText: string;
  metaIcon: Parameters<typeof HexagonIcon>[0]['icon'];
  metaIconLibrary: Parameters<typeof HexagonIcon>[0]['library'];
  badgeText?: string;
  secondaryText?: string;
  width: number;
  onPress?: () => void;
}

export function HomeImageCard({
  imageUri,
  title,
  metaText,
  metaIcon,
  metaIconLibrary,
  badgeText,
  secondaryText,
  width,
  onPress,
}: HomeImageCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.92} style={[styles.card, { width }]} onPress={onPress}>
      <ImageBackground source={{ uri: imageUri }} style={styles.cardImage} imageStyle={styles.cardRadius}>
        <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.95)']} style={StyleSheet.absoluteFill} />
        <View style={styles.cardContent}>
          {!!badgeText && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <HexagonIcon icon={metaIcon} library={metaIconLibrary} size="small" />
            <Text style={styles.metaText}>{metaText}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {!!secondaryText && <Text style={styles.secondaryText}>{secondaryText}</Text>}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#0F0F11',
  },
  cardImage: {
    flex: 1,
  },
  cardRadius: {
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});


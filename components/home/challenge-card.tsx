import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { HexagonIcon } from './hexagon-icon';

interface ChallengeCardProps {
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
}

export function ChallengeCard({ title, subtitle, badge, image }: ChallengeCardProps) {
  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: image }} style={styles.bgImage}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.999)']}
          style={styles.cardGradient}
        />
        <View style={styles.cardContent}>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
          <View style={styles.subtitleRow}>
            <HexagonIcon icon="star" library="Ionicons" size="small" />
            <Text style={[styles.subtitleText, { marginLeft: 8 }]}>{subtitle}</Text>
          </View>
          <Text style={styles.challengeTitle}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#27272a',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  cardContent: {
    padding: 20,
  },
  badge: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: 'black',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    color: '#e4e4e7',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  challengeTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
});

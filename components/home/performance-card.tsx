import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { HexagonIcon } from './hexagon-icon';

interface PerformanceCardProps {
  title: string;
  value: string;
  date: string;
  image: string;
}

export function PerformanceCard({ title, value, date, image }: PerformanceCardProps) {
  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: image }} style={styles.bgImage}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.999)']}
          style={styles.cardGradient}
        />
        <View style={styles.cardContent}>
          <View style={styles.subtitleRow}>
            <HexagonIcon icon="time-outline" library="Ionicons" size="small" />
            <Text style={[styles.subtitleText, { marginLeft: 8 }]}>{date}</Text>
          </View>
          <Text style={styles.perfTitle}>{title}</Text>
          <Text style={styles.perfValue}>{value}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 180,
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
  perfTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  perfValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

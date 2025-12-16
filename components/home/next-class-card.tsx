import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { PulsatingCard } from './pulsating-card';

interface NextClassCardProps {
  date: string;
  time: string;
  className: string;
  location: string;
  onPress: () => void;
}

export function NextClassCard({ date, time, className, location, onPress }: NextClassCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.sectionTitleBase}>
          NEXT CLASS AT <Text style={styles.locationHighlight}>{location}</Text>
        </Text>
      </View>

      <PulsatingCard onPress={onPress}>
        <View>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <View style={styles.trooperBox}>
          <Text style={styles.trooperText}>{className}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#52525b" />
      </PulsatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginBottom: 40,
  },
  titleWrapper: {
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionTitleBase: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  locationHighlight: {
    color: 'white',
  },
  dateText: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  trooperBox: {
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  trooperText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});

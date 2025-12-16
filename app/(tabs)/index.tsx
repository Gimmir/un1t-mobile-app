import {
  ChallengesSection,
  NextClassCard,
  PerformanceSection,
  PowerCard,
} from '@/components/home';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHALLENGES = [
  {
    id: '1',
    title: '500 M ROW',
    subtitle: 'TIER 3 • PB 2:42',
    badge: 'CHALLENGE OF THE MONTH',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '100 BURPEES',
    subtitle: 'TIER 1 • PB 8:15',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
  },
];

const PERFORMANCE = [
  {
    id: '1',
    title: 'DEADLIFT',
    value: '150 KG',
    date: 'SEP 11, 11.00 AM',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'BENCH PRESS',
    value: '110 KG',
    date: 'SEP 14, 10.00 AM',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function HomeScreen() {
  const handleNextClassPress = () => {
    console.log('Next Class Pressed!');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.textureWrapper}>
        <Image
          source={require('@/assets/images/home-top-texture.png')}
          style={styles.textureImage}
          resizeMode="cover"
        />
        <LinearGradient colors={['transparent', '#191919']} style={styles.gradientOverlay} />
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>WELCOME BACK, JO</Text>
          </View>

          <PowerCard />

          <NextClassCard
            date="SEP 30"
            time="9.00 AM"
            className="TROOPER"
            location="LONDON BRIDGE"
            onPress={handleNextClassPress}
          />

          <ChallengesSection challenges={CHALLENGES} />

          <PerformanceSection performance={PERFORMANCE} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  textureWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    opacity: 0.6,
  },
  textureImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChallengeCard } from './challenge-card';
import { PaginationDots } from './pagination-dots';

const CARD_WIDTH = 300 + 16;

interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
}

interface ChallengesSectionProps {
  challenges: Challenge[];
}

export function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.titleWrapper}>
        <Text style={styles.sectionTitle}>CHALLENGES</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
      >
        {challenges.map((item) => (
          <ChallengeCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            badge={item.badge}
            image={item.image}
          />
        ))}
      </ScrollView>

      <PaginationDots count={challenges.length} activeIndex={activeIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  titleWrapper: {
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

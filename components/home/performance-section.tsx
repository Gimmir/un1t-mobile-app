import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PaginationDots } from './pagination-dots';
import { PerformanceCard } from './performance-card';

const CARD_WIDTH = 280 + 16;

interface Performance {
  id: string;
  title: string;
  value: string;
  date: string;
  image: string;
}

interface PerformanceSectionProps {
  performance: Performance[];
}

export function PerformanceSection({ performance }: PerformanceSectionProps) {
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
        <Text style={styles.sectionTitle}>PERFORMANCE</Text>
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
        {performance.map((item) => (
          <PerformanceCard
            key={item.id}
            title={item.title}
            value={item.value}
            date={item.date}
            image={item.image}
          />
        ))}
      </ScrollView>

      <PaginationDots count={performance.length} activeIndex={activeIndex} />
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

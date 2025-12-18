import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PaginationDots } from './pagination-dots';

interface SnapCarouselSectionProps {
  title: string;
  snapInterval: number;
  outerMargin: number;
  itemSpacing: number;
  itemWidth: number;
  children: (itemWidth: number) => ReactNode;
  count: number;
}

export function SnapCarouselSection({
  title,
  snapInterval,
  outerMargin,
  itemSpacing,
  itemWidth,
  children,
  count,
}: SnapCarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const contentContainerStyle = useMemo(
    () => ({ paddingLeft: outerMargin, paddingRight: outerMargin, gap: itemSpacing }),
    [outerMargin, itemSpacing]
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.max(0, Math.min(count - 1, Math.round(offsetX / snapInterval)));
      setActiveIndex(index);
    },
    [count, snapInterval]
  );

  return (
    <View style={styles.carouselSection}>
      <Text style={styles.carouselEyebrow}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {children(itemWidth)}
      </ScrollView>
      <PaginationDots count={count} activeIndex={activeIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselSection: {
    marginBottom: 32,
    gap: 12,
  },
  carouselEyebrow: {
    color: '#9CA3AF',
    fontSize: 12,
    letterSpacing: 1.5,
    marginLeft: 20,
  },
});


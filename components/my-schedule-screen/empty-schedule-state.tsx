import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

export type ScheduleTab = 'upcoming' | 'history';

export function EmptyScheduleState({
  tab,
  onBrowseClasses,
  bottomInset,
}: {
  tab: ScheduleTab;
  onBrowseClasses: () => void;
  bottomInset: number;
}) {
  const title = tab === 'upcoming' ? 'NO BOOKED CLASSES' : 'NO CLASS HISTORY';
  const subtitle =
    tab === 'upcoming'
      ? "You don't have any booked classes yet. Get in shape — choose what fits you best."
      : "No past classes yet. Book your first session and it’ll show up here.";

  return (
    <View style={[styles.emptyWrap, { paddingBottom: Math.max(24, bottomInset + 120) }]}>
      <View style={styles.emptyPanel}>
        <BlurView intensity={22} tint="dark" style={styles.emptyBlur}>
          <LinearGradient
            colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)', 'rgba(0,0,0,0.35)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.emptyContent}>
            <Text style={styles.emptyKicker}>{tab === 'upcoming' ? 'UPCOMING' : 'HISTORY'}</Text>
            <Text style={styles.emptyTitle}>{title}</Text>
            <Text style={styles.emptySubtitle}>{subtitle}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              onPress={onBrowseClasses}
              style={styles.emptyCta}
            >
              <Text style={styles.emptyCtaText}>BROWSE CLASSES</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}


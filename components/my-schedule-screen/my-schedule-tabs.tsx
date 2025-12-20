import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import type { ScheduleTab } from './empty-schedule-state';

export function MyScheduleTabs({
  tab,
  setTab,
}: {
  tab: ScheduleTab;
  setTab: (tab: ScheduleTab) => void;
}) {
  return (
    <>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => setTab('upcoming')}
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>UPCOMING</Text>
          <View style={[styles.tabUnderline, tab === 'upcoming' && styles.tabUnderlineActive]} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => setTab('history')}
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>HISTORY</Text>
          <View style={[styles.tabUnderline, tab === 'history' && styles.tabUnderlineActive]} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsDivider} />
    </>
  );
}


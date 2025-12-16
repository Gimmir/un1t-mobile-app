import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavigationButtonsProps {
  isCalendarOpen: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
  onToggleCalendar: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  isCalendarOpen,
  onPrevious,
  onNext,
  onToday,
  onToggleCalendar,
}) => {
  return (
    <View style={styles.navigationButtons}>
      <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {!isCalendarOpen && onToday && (
        <TouchableOpacity onPress={onToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>TODAY</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.navButton} onPress={onToggleCalendar}>
        <Ionicons name={isCalendarOpen ? 'close' : 'calendar-outline'} size={20} color="#71717A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    padding: 4,
  },
  todayButton: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  todayButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

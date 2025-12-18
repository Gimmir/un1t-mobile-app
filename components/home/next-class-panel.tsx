import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NextClassPanelProps {
  program: string;
  date: string;
  time: string;
  location: string;
  onPress?: () => void;
}

export function NextClassPanel({ program, date, time, location, onPress }: NextClassPanelProps) {
  return (
    <View style={styles.nextClassSection}>
      <Text style={styles.nextClassLabel}>
        NEXT CLASS AT <Text style={styles.nextClassLocation}>{location}</Text>
      </Text>

      <TouchableOpacity activeOpacity={0.9} style={styles.nextClassCard} onPress={onPress}>
        <View style={styles.nextClassInfo}>
          <Text style={styles.nextClassDate}>{date}</Text>
          <Text style={styles.nextClassTime}>{time}</Text>
        </View>
        <View style={styles.nextClassProgram}>
          <Text style={styles.nextClassProgramText}>{program}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nextClassSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 10,
  },
  nextClassLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  nextClassLocation: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  nextClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F11',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 16,
  },
  nextClassInfo: {
    flex: 1,
    gap: 4,
  },
  nextClassDate: {
    color: '#9CA3AF',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  nextClassTime: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextClassProgram: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextClassProgramText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});


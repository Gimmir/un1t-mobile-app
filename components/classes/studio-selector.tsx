import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const StudioSelector: React.FC = () => {
  return (
    <View style={styles.topBar}>
      <View style={styles.studioSection}>
        <Text style={styles.studioLabel}>STUDIO</Text>
        <View style={styles.studioRow}>
          <Text style={styles.studioName}>London Bridge</Text>
          <Ionicons name="chevron-down" size={16} color="#71717A" />
        </View>
      </View>

      <TouchableOpacity style={styles.scheduleButton}>
        <Text style={styles.scheduleButtonText}>MY SCHEDULE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  studioSection: {
    flex: 1,
  },
  studioLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  studioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studioName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scheduleButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  scheduleButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

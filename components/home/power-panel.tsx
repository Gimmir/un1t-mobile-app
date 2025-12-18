import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HexagonIcon } from './hexagon-icon';

export function PowerPanel() {
  return (
    <View style={styles.surface}>
      <View style={styles.surfaceHeader}>
        <Text style={styles.surfaceEyebrow}>CURRENT PHASE</Text>
        <Text style={styles.surfaceTitle}>POWER</Text>
      </View>
      <View style={styles.surfaceDivider} />
      <View style={styles.powerRow}>
        <View style={styles.powerItem}>
          <HexagonIcon icon="barbell" library="Ionicons" size="medium" />
          <View style={styles.powerCopy}>
            <Text style={styles.powerMeta}>WEEK 3</Text>
            <Text style={styles.powerValue}>REPS 6-8</Text>
          </View>
        </View>
        <View style={styles.powerDivider} />
        <View style={styles.powerItem}>
          <HexagonIcon icon="flame" library="Ionicons" size="medium" />
          <View style={styles.powerCopy}>
            <Text style={styles.powerMeta}>DAILY CALORIES</Text>
            <Text style={styles.powerValue}>2185 KCAL</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
  },
  surfaceHeader: {
    alignItems: 'center',
  },
  surfaceEyebrow: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 2,
  },
  surfaceTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 6,
  },
  surfaceDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginVertical: 16,
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  powerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  powerCopy: {
    flex: 1,
  },
  powerDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#27272A',
  },
  powerMeta: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },
  powerValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});


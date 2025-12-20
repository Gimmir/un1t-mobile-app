import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function MembershipCard(props: {
  remaining: number;
  total: number;
  expires: string;
  onPressCta?: () => void;
}) {
  const { remaining, total, expires, onPressCta } = props;

  return (
    <View style={styles.membershipCard}>
      <Text style={styles.cardTitle}>MEMBERSHIP AND PASSES</Text>
      <Text style={styles.bundleLabel}>{total} CLASS BUNDLE</Text>
      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CREDITS REMAINING</Text>
          <Text style={styles.statValue}>
            {remaining}
            <Text style={styles.statValueTotal}>/{total}</Text>
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>EXPIRES</Text>
          <Text style={styles.statValue}>{expires}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <TouchableOpacity activeOpacity={0.8} style={styles.ctaButton} onPress={onPressCta}>
        <Text style={styles.ctaText}>BUY MEMBERSHIP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  membershipCard: {
    backgroundColor: '#101012',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginHorizontal: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bundleLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValueTotal: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginBottom: 18,
  },
  ctaButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
});


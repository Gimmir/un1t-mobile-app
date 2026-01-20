import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function MembershipCard(props: {
  remaining: number | null;
  total: number | null;
  expires: string | null;
  planTitle?: string | null;
  onPressCta?: () => void;
}) {
  const { remaining, total, expires, planTitle, onPressCta } = props;
  const formatCredits = (value: number | null) => {
    if (value == null) return '—';
    if (!Number.isFinite(value)) return '∞';
    return String(value);
  };
  const remainingText = formatCredits(remaining);
  const totalText = formatCredits(total);
  const showTotal = Number.isFinite(total ?? Number.NaN) && remaining !== Number.POSITIVE_INFINITY;
  const expiresText = expires && expires.trim().length > 0 ? expires : '—';
  const resolvedPlanTitle = planTitle && planTitle.trim().length > 0 ? planTitle : '—';
  const isPlanMissing = resolvedPlanTitle === '—';
  const bundleLabel = resolvedPlanTitle;

  return (
    <View style={styles.membershipCard}>
      <Text style={styles.cardTitle}>MEMBERSHIP AND PASSES</Text>
      <Text style={[styles.bundleLabel, isPlanMissing && styles.bundleLabelMuted]}>
        {bundleLabel}
      </Text>
      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CREDITS</Text>
          <Text style={styles.statValue}>
            {remainingText}
            {showTotal ? <Text style={styles.statValueTotal}>/{totalText}</Text> : null}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>EXPIRES</Text>
          <Text style={styles.statValue}>{expiresText}</Text>
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
    backgroundColor: colors.surface.base,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    marginHorizontal: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bundleLabel: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  bundleLabelMuted: {
    color: colors.text.muted,
    fontWeight: typography.weight.heavy,
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
    color: colors.text.muted,
    fontSize: typography.size.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  statValueTotal: {
    color: colors.text.muted,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    letterSpacing: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.surface.panel,
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
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
  },
});

import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

interface CreditSummaryCardProps {
  remaining: number | null;
  total: number | null;
  expires: string | null;
  status: string;
}

export function CreditSummaryCard({ remaining, total, expires, status }: CreditSummaryCardProps) {
  const formatCredits = (value: number | null) => {
    if (value == null) return '—';
    if (!Number.isFinite(value)) return '∞';
    return String(value);
  };
  const remainingText = formatCredits(remaining);
  const totalText = formatCredits(total);
  const showTotal = Number.isFinite(total ?? Number.NaN) && remaining !== Number.POSITIVE_INFINITY;
  const expiresText = expires && expires.trim().length > 0 ? expires : '—';
  const statusColor = (() => {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'inactive') return '#FBBF24';
    if (normalized === 'blocked') return '#F43F5E';
    if (normalized === 'active') return '#34D399';
    return colors.text.muted;
  })();

  return (
    <View style={styles.creditSurface}>
      <CreditColumn label="CREDITS">
        <Text style={styles.creditValue}>
          {remainingText}
          {showTotal ? <Text style={styles.creditTotal}>/{totalText}</Text> : null}
        </Text>
      </CreditColumn>

      <View style={styles.creditDivider} />

      <CreditColumn label="EXPIRES">
        <Text style={styles.creditValue}>{expiresText}</Text>
      </CreditColumn>

      <View style={styles.creditDivider} />

      <CreditColumn label="STATUS">
        <Text style={[styles.creditBadge, { color: statusColor }]}>{status}</Text>
      </CreditColumn>
    </View>
  );
}

function CreditColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.creditColumn}>
      <Text style={styles.creditLabel}>{label}</Text>
      <View style={styles.creditValueWrapper}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  creditSurface: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  creditColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  creditLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  creditValueWrapper: {
    marginTop: 6,
  },
  creditValue: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    lineHeight: 22,
    fontWeight: typography.weight.heavy,
  },
  creditTotal: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    lineHeight: 22,
    fontWeight: typography.weight.semibold,
  },
  creditDivider: {
    width: 1,
    backgroundColor: colors.surface.elevated,
    marginHorizontal: 14,
    height: '100%',
  },
  creditBadge: {
    color: '#34D399',
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
    fontSize: typography.size.md,
    lineHeight: 22,
    textTransform: 'uppercase',
  },
});

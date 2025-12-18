import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CreditSummaryCardProps {
  remaining: number;
  total: number;
  expires: string;
  status: string;
}

export function CreditSummaryCard({ remaining, total, expires, status }: CreditSummaryCardProps) {
  return (
    <View style={styles.creditSurface}>
      <CreditColumn label="CREDITS">
        <Text style={styles.creditValue}>
          {remaining}
          <Text style={styles.creditTotal}>/{total}</Text>
        </Text>
      </CreditColumn>

      <View style={styles.creditDivider} />

      <CreditColumn label="EXPIRES">
        <Text style={styles.creditValue}>{expires}</Text>
      </CreditColumn>

      <View style={styles.creditDivider} />

      <CreditColumn label="STATUS">
        <Text style={styles.creditBadge}>{status}</Text>
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
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  creditColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  creditLabel: {
    color: '#6B7280',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  creditValueWrapper: {
    marginTop: 6,
  },
  creditValue: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
  },
  creditTotal: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  creditDivider: {
    width: 1,
    backgroundColor: '#1F1F23',
    marginHorizontal: 14,
    height: '100%',
  },
  creditBadge: {
    color: '#22C55E',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 14,
    lineHeight: 22,
    textTransform: 'uppercase',
  },
});


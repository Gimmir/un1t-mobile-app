import { PrimaryButton } from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export function Step5Content(props: { onLetsGo: () => void }) {
  const { onLetsGo } = props;

  return (
    <>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <IconSymbol name="checkmark" size={22} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>YOU&apos;RE ALL SET</Text>
        <Text style={styles.subtitle}>Welcome to UN1T. Your account has been created and you&apos;re ready to train.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>NEXT STEPS</Text>
        <Text style={styles.cardText}>Browse classes, book your first session, and sync your schedule.</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton title="LET'S GO" onPress={onLetsGo} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  badge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: colors.surface.base,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
  cardText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    lineHeight: 18,
    marginTop: 10,
  },
});
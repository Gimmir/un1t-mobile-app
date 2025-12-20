import { PrimaryButton } from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    borderColor: '#1F1F23',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#101012',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  cardText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 10,
  },
});


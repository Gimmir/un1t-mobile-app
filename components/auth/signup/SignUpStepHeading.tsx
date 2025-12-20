import React from 'react';
import { StyleSheet, Text } from 'react-native';

export function SignUpStepHeading(props: { title: string; subtitle?: string }) {
  const { title, subtitle } = props;
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
});


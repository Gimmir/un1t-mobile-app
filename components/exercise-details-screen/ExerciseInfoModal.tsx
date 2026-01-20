import React, { useMemo } from 'react';
import { Image, type ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { InfoModalShell } from '@/components/modals/InfoModalShell';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type ExerciseInfoModalProps = {
  visible: boolean;
  title: string;
  description: string;
  image: ImageSourcePropType | string;
  onClose: () => void;
};

export function ExerciseInfoModal({
  visible,
  title,
  description,
  image,
  onClose,
}: ExerciseInfoModalProps) {
  const resolvedSource = useMemo(
    () => (typeof image === 'string' ? { uri: image } : image),
    [image]
  );

  return (
    <InfoModalShell visible={visible} title={title} onClose={onClose}>
      <View style={styles.imageFrame}>
        <Image source={resolvedSource} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.sectionLabel}>DESCRIPTION</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </InfoModalShell>
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.deep,
  },
  image: {
    width: '100%',
    height: 160,
  },
  sectionLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
  },
  descriptionText: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    lineHeight: 20,
  },
});

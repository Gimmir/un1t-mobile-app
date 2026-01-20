import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

export type ExerciseCardData = {
  id: string;
  name: string;
  weight: string;
  image?: ImageSourcePropType | string;
};

type ExerciseListSectionProps = {
  title: string;
  exercises: ExerciseCardData[];
  fallbackImage: ImageSourcePropType;
  onPressExercise: (exercise: ExerciseCardData) => void;
};

export function ExerciseListSection({
  title,
  exercises,
  fallbackImage,
  onPressExercise,
}: ExerciseListSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          fallbackImage={fallbackImage}
          onPress={() => onPressExercise(exercise)}
        />
      ))}
    </View>
  );
}

type ExerciseCardProps = {
  exercise: ExerciseCardData;
  fallbackImage: ImageSourcePropType;
  onPress: () => void;
};

function ExerciseCard({ exercise, fallbackImage, onPress }: ExerciseCardProps) {
  const imageSource =
    typeof exercise.image === 'string'
      ? { uri: exercise.image }
      : exercise.image ?? fallbackImage;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      accessibilityRole="button"
      style={styles.exerciseCard}
      onPress={onPress}
    >
      <Image source={imageSource} style={styles.exerciseImage} resizeMode="cover" />
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={styles.exerciseMeta}>
          <Text style={styles.exerciseMetaLabel}>WEIGHT</Text>
          <Text style={styles.exerciseMetaValue}>{exercise.weight}</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.text.muted}
        style={styles.exerciseChevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
    marginLeft: 4,
    marginBottom: 10,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
  },
  exerciseImage: {
    width: 72,
    height: 72,
    borderRadius: 4,
    backgroundColor: colors.surface.deep,
  },
  exerciseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  exerciseMeta: {
    marginTop: 6,
  },
  exerciseMetaLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  exerciseMetaValue: {
    marginTop: 2,
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    color: '#E4E4E7',
    letterSpacing: 0.6,
  },
  exerciseChevron: {
    marginLeft: 6,
  },
});

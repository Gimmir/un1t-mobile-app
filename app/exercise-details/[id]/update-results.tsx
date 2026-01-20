import { ExerciseInfoModal, ExerciseRepSelector } from '@/components/exercise-details-screen';
import { EXERCISE_CARDS, FALLBACK_IMAGE } from '@/components/performance-screen/performance-data';
import {
  UpdateResultsLayout,
  UpdateResultsPrimaryButton,
  UpdateResultsSectionLabel,
  UpdateResultsTextInput,
} from '@/components/update-results';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

const REP_OPTIONS = [1, 3, 5] as const;
type RepOption = (typeof REP_OPTIONS)[number];

export default function UpdateResultsScreen() {
  const router = useRouter();
  const { reps, id, name } = useLocalSearchParams<{ reps?: string; id?: string; name?: string }>();
  const initialRep = useMemo<RepOption>(() => {
    const parsed = Number(reps);
    return REP_OPTIONS.includes(parsed as RepOption) ? (parsed as RepOption) : 3;
  }, [reps]);
  const [selectedRep, setSelectedRep] = useState<RepOption>(initialRep);
  const [score, setScore] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const exerciseTitle = useMemo(() => {
    if (typeof name === 'string' && name.trim()) return name.trim();
    if (typeof id === 'string' && id.trim()) return id.replace(/-/g, ' ');
    return 'Exercise';
  }, [id, name]);

  const exerciseImage = useMemo(() => {
    if (typeof id === 'string' && id.trim()) {
      const match = EXERCISE_CARDS.find((exercise) => exercise.id === id);
      if (match?.image) return match.image;
    }
    return FALLBACK_IMAGE;
  }, [id]);

  const description =
    "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.";

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }}
      />
      <StatusBar style="light" />
      <UpdateResultsLayout
        headerTitle="ENTER YOUR SCORE"
        onClose={() => router.back()}
        helpText="How do I perform this exercise?"
        onHelpPress={() => setShowInfoModal(true)}
      >
        <UpdateResultsSectionLabel align="center" style={styles.sectionTitle}>
          HOW MANY REPS DID YOU COMPLETE?
        </UpdateResultsSectionLabel>

        <ExerciseRepSelector
          options={REP_OPTIONS}
          value={selectedRep}
          onChange={setSelectedRep}
        />

        <UpdateResultsTextInput
          value={score}
          onChangeText={setScore}
          placeholder="Enter score"
          onSubmitEditing={Keyboard.dismiss}
          unit="KG"
          containerStyle={styles.scoreInputSpacing}
        />

        <UpdateResultsPrimaryButton label="SAVE" onPress={Keyboard.dismiss} />
      </UpdateResultsLayout>
      <ExerciseInfoModal
        visible={showInfoModal}
        title={exerciseTitle}
        description={description}
        image={exerciseImage}
        onClose={() => setShowInfoModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  scoreInputSpacing: {
    marginBottom: 22,
  },
});

import {
  ExerciseInfoModal,
  ExerciseRepSelector,
} from "@/components/exercise-details-screen";
import {
  EXERCISE_CARDS,
  FALLBACK_IMAGE,
} from "@/components/performance-screen/performance-data";
import {
  UpdateResultsDateCard,
  UpdateResultsLayout,
  UpdateResultsPrimaryButton,
  UpdateResultsSectionLabel,
  UpdateResultsTextInput,
} from "@/components/update-results";
import {
  formatTargetDate,
  getStartOfToday,
  parseTargetDate,
} from "@/components/body-composition-details-screen/body-composition-update-results.utils";
import { DobPickerModal } from "@/components/profile/account-details/DobPickerModal";
import { usePerformanceLog } from "@/src/features/performance/hooks/use-performance-log";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

const REP_OPTIONS = [1, 3, 5] as const;
type RepOption = (typeof REP_OPTIONS)[number];

const DEFAULT_DESCRIPTION =
  "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.";
const SQUAT_DESCRIPTION =
  "The Barbell Squat is the foundational compound exercise for building lower body strength and mass. It primarily targets your quadriceps, glutes, and hamstrings while engaging your core for stability. Master this movement to improve overall power and athleticism.";
const DEADLIFT_DESCRIPTION =
  "The Deadlift is the ultimate compound movement for building total-body strength. It primarily targets your posterior chain (hamstrings, glutes, and lower back) while developing grip strength and core stability. This essential lift teaches you to lift heavy objects safely and efficiently.";
const BENCH_PRESS_DESCRIPTION =
  "The Bench Press is the primary compound exercise for building upper body size and strength. It targets your chest (pectorals), shoulders (deltoids), and triceps. Mastering this lift is key for developing pushing power and muscular endurance.";

export default function UpdateResultsScreen() {
  const router = useRouter();
  const { reps, id, name, editEntryId, editValue, editDate, editReps } =
    useLocalSearchParams<{
      reps?: string;
      id?: string;
      name?: string;
      editEntryId?: string;
      editValue?: string;
      editDate?: string;
      editReps?: string;
    }>();

  const isEditMode = typeof editEntryId === "string" && editEntryId.trim().length > 0;

  const initialRep = useMemo<RepOption>(() => {
    const sourceReps = isEditMode ? editReps : reps;
    const parsed = Number(sourceReps);
    return REP_OPTIONS.includes(parsed as RepOption)
      ? (parsed as RepOption)
      : 3;
  }, [reps, editReps, isEditMode]);

  const initialScore = useMemo(() => {
    if (isEditMode && typeof editValue === "string" && editValue.trim()) {
      return editValue.trim();
    }
    return "";
  }, [isEditMode, editValue]);

  const maxDate = useMemo(() => getStartOfToday(), []);

  const initialResultDate = useMemo(() => {
    if (isEditMode && typeof editDate === "string" && editDate.trim()) {
      const parsed = parseTargetDate(editDate);
      return parsed.getTime() > maxDate.getTime() ? maxDate : parsed;
    }
    return getStartOfToday();
  }, [isEditMode, editDate, maxDate]);

  const [selectedRep, setSelectedRep] = useState<RepOption>(initialRep);
  const [score, setScore] = useState(initialScore);
  const [resultDate, setResultDate] = useState<Date>(initialResultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const { mutate: logPerformance, isPending } = usePerformanceLog();

  const formattedResultDate = useMemo(() => formatTargetDate(resultDate), [resultDate]);

  const exerciseTitle = useMemo(() => {
    if (typeof name === "string" && name.trim()) return name.trim();
    if (typeof id === "string" && id.trim()) return id.replace(/-/g, " ");
    return "Exercise";
  }, [id, name]);

  const exerciseImage = useMemo(() => {
    if (typeof id === "string" && id.trim()) {
      const match = EXERCISE_CARDS.find((exercise) => exercise.id === id);
      if (match?.image) return match.image;
    }
    return FALLBACK_IMAGE;
  }, [id]);

  const description = useMemo(() => {
    const normalizedId =
      typeof id === "string"
        ? id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")
        : "";
    if (normalizedId === "squat") return SQUAT_DESCRIPTION;
    if (normalizedId === "deadlift") return DEADLIFT_DESCRIPTION;
    if (normalizedId === "bench_press") return BENCH_PRESS_DESCRIPTION;
    return DEFAULT_DESCRIPTION;
  }, [id]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      const clamped = selectedDate.getTime() > maxDate.getTime()
        ? maxDate
        : selectedDate;
      setResultDate(clamped);
    }
    if (event.type === "dismissed") setShowDatePicker(false);
  };

  const handleSave = () => {
    if (isPending) return;
    const normalizedScore = Number.parseFloat(score.replace(",", ".").trim());
    if (!Number.isFinite(normalizedScore)) {
      Alert.alert("Missing score", "Please enter a numeric value.");
      return;
    }

    const repLabel = selectedRep === 1 ? "1-rep" : `${selectedRep}-reps`;
    const rawSlug = typeof id === "string" && id.trim() ? id : exerciseTitle;
    const slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_+|_+$)/g, "");
    const dateIso = resultDate.toISOString();

    const payload = {
      kind: "exercise" as const,
      name: exerciseTitle,
      slug: slug || "exercise",
      type: repLabel,
      value: normalizedScore,
      date: dateIso,
    };

    logPerformance(payload, {
      onSuccess: () => {
        Keyboard.dismiss();
        router.back();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to save result.");
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <StatusBar style="light" />
      <UpdateResultsLayout
        headerTitle={isEditMode ? "EDIT YOUR SCORE" : "ENTER YOUR SCORE"}
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

        <UpdateResultsSectionLabel style={styles.sectionLabel}>
          DATE OF ACHIEVEMENT
        </UpdateResultsSectionLabel>
        <UpdateResultsDateCard
          value={formattedResultDate}
          onPress={() => {
            Keyboard.dismiss();
            setShowDatePicker(true);
          }}
        />

        <UpdateResultsPrimaryButton
          label={isPending ? "Saving..." : "SAVE"}
          onPress={handleSave}
        />
      </UpdateResultsLayout>

      <ExerciseInfoModal
        visible={showInfoModal}
        title={exerciseTitle}
        description={description}
        image={exerciseImage}
        onClose={() => setShowInfoModal(false)}
      />

      <DobPickerModal
        visible={showDatePicker}
        value={resultDate}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
        title="DATE OF ACHIEVEMENT"
        showTopBorder={false}
        maximumDate={maxDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  scoreInputSpacing: {
    marginBottom: 22,
  },
  sectionLabel: {
    marginBottom: 10,
  },
});

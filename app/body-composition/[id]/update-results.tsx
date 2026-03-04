import {
  normalizeUnit,
  resolveBodyCompositionMetric,
  resolveBodyCompositionTitle,
} from "@/components/body-composition-details-screen/body-composition-utils";
import {
  buildBodyCompositionInfoContent,
  buildTargetRangeSubtitle,
  clampToMinDate,
  formatTargetDate,
  getStartOfToday,
  parseTargetDate,
} from "@/components/body-composition-details-screen/body-composition-update-results.utils";
import { BodyCompositionInfoModal } from "@/components/body-composition-details-screen";
import { DobPickerModal } from "@/components/profile/account-details/DobPickerModal";
import {
  UpdateResultsDateCard,
  UpdateResultsLayout,
  UpdateResultsPrimaryButton,
  UpdateResultsSectionLabel,
  UpdateResultsTextInput,
} from "@/components/update-results";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { usePerformanceLog } from "@/src/features/performance/hooks/use-performance-log";
import { usePerformanceSummary } from "@/src/features/performance/hooks/use-performance-summary";
import { toPerformanceSlug } from "@/src/features/performance/utils/performance-slug";
import {
  resolveTargetDate,
  resolveTargetValue,
} from "@/src/features/performance/utils/performance-target";
import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ActivePicker = "result" | "target" | null;

export default function BodyCompositionUpdateResultsScreen() {
  const router = useRouter();
  const { data: user } = useAuth();
  const userId = user?._id ?? user?.id;
  const { id, label, editEntryId, editValue, editDate } = useLocalSearchParams<{
    id?: string;
    label?: string;
    editEntryId?: string;
    editValue?: string;
    editDate?: string;
  }>();

  const isEditMode = typeof editEntryId === "string" && editEntryId.trim().length > 0;

  const metric = useMemo(
    () => resolveBodyCompositionMetric(id, label),
    [id, label],
  );
  const resolvedTitle = useMemo(
    () =>
      resolveBodyCompositionTitle(
        metric,
        typeof label === "string" ? label : undefined,
      ),
    [metric, label],
  );
  const helpTitle = metric?.helpTitle ?? `What is ${resolvedTitle}`;
  const unitLabel = normalizeUnit(metric?.current.unit);
  const targetUnit = normalizeUnit(metric?.target.unit) || unitLabel;
  const targetMinimumDate = useMemo(() => {
    const date = getStartOfToday();
    date.setDate(date.getDate() + 7);
    return date;
  }, []);
  const resultMaxDate = useMemo(() => getStartOfToday(), []);
  const { data: summary } = usePerformanceSummary(userId);

  const resolvedSlug = useMemo(() => {
    if (metric?.slug) return metric.slug;
    if (metric?.detailTitle) return toPerformanceSlug(metric.detailTitle);
    if (metric?.label) return toPerformanceSlug(metric.label);
    if (typeof id === "string" && id.trim()) return toPerformanceSlug(id);
    return toPerformanceSlug(resolvedTitle);
  }, [metric, id, resolvedTitle]);
  const matchedMeasurement = useMemo(() => {
    const list = summary?.measurements ?? [];
    if (!list.length) return undefined;
    return (
      list.find((item) => item.slug === resolvedSlug) ??
      list.find(
        (item) =>
          item.name?.trim().toLowerCase() ===
          resolvedTitle.trim().toLowerCase(),
      )
    );
  }, [summary, resolvedSlug, resolvedTitle]);
  const backendTargetValue = useMemo(
    () => resolveTargetValue(matchedMeasurement),
    [matchedMeasurement],
  );
  const backendTargetDate = useMemo(
    () => resolveTargetDate(matchedMeasurement),
    [matchedMeasurement],
  );

  const initialLatestMeasure = useMemo(() => {
    if (isEditMode && typeof editValue === "string" && editValue.trim()) {
      return editValue.trim();
    }
    return "";
  }, [isEditMode, editValue]);

  const initialResultDate = useMemo(() => {
    if (isEditMode && typeof editDate === "string" && editDate.trim()) {
      const parsed = parseTargetDate(editDate);
      return parsed.getTime() > resultMaxDate.getTime() ? resultMaxDate : parsed;
    }
    return getStartOfToday();
  }, [isEditMode, editDate, resultMaxDate]);

  const [latestMeasure, setLatestMeasure] = useState(initialLatestMeasure);
  const [resultDate, setResultDate] = useState<Date>(initialResultDate);
  const [targetValue, setTargetValue] = useState(metric?.target.value ?? "");
  const [targetDate, setTargetDate] = useState<Date>(() =>
    clampToMinDate(parseTargetDate(metric?.targetDate), targetMinimumDate),
  );
  const [hasEditedTargetValue, setHasEditedTargetValue] = useState(false);
  const [hasEditedTargetDate, setHasEditedTargetDate] = useState(false);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const { mutate: logPerformance, isPending } = usePerformanceLog();

  useEffect(() => {
    if (hasEditedTargetValue) return;
    if (typeof backendTargetValue === "string" && backendTargetValue.trim()) {
      setTargetValue(backendTargetValue);
    }
  }, [backendTargetValue, hasEditedTargetValue]);

  useEffect(() => {
    if (hasEditedTargetDate) return;
    if (typeof backendTargetDate === "string" && backendTargetDate.trim()) {
      setTargetDate(
        clampToMinDate(parseTargetDate(backendTargetDate), targetMinimumDate),
      );
    }
  }, [backendTargetDate, hasEditedTargetDate, targetMinimumDate]);

  const targetLabel = unitLabel ? `TARGET ${unitLabel}` : "TARGET";
  const formattedResultDate = useMemo(() => formatTargetDate(resultDate), [resultDate]);
  const formattedTargetDate = useMemo(() => formatTargetDate(targetDate), [targetDate]);
  const targetRangeSubtitle = useMemo(
    () => buildTargetRangeSubtitle(user),
    [user],
  );
  const infoContent = useMemo(
    () =>
      buildBodyCompositionInfoContent(
        metric,
        resolvedTitle,
        targetRangeSubtitle,
        user,
      ),
    [metric, resolvedTitle, targetRangeSubtitle],
  );

  const handleResultDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setActivePicker(null);
    if (selectedDate) {
      const clamped = selectedDate.getTime() > resultMaxDate.getTime()
        ? resultMaxDate
        : selectedDate;
      setResultDate(clamped);
    }
    if (event.type === "dismissed") setActivePicker(null);
  };

  const handleTargetDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setActivePicker(null);
    if (selectedDate) {
      setTargetDate(clampToMinDate(selectedDate, targetMinimumDate));
      setHasEditedTargetDate(true);
    }
    if (event.type === "dismissed") setActivePicker(null);
  };

  const handleSave = () => {
    if (isPending) return;
    const normalizedValue = Number.parseFloat(
      latestMeasure.replace(",", ".").trim(),
    );
    if (!Number.isFinite(normalizedValue)) {
      Alert.alert("Missing value", "Please enter a numeric value.");
      return;
    }

    const name = resolvedTitle.replace(/\s+/g, " ").trim() || resolvedTitle;
    const slug =
      metric?.slug ??
      toPerformanceSlug(metric?.detailTitle ?? metric?.label ?? resolvedTitle);
    const type = metric?.type ?? slug;
    const normalizedTarget = Number.parseFloat(
      targetValue.replace(",", ".").trim(),
    );
    const hasTargetValue = Number.isFinite(normalizedTarget);
    const dateIso = resultDate.toISOString();

    const payload = {
      kind: "measurement" as const,
      name,
      slug: slug || "measurement",
      type,
      value: normalizedValue,
      date: dateIso,
      targetValue: hasTargetValue ? normalizedTarget : undefined,
      targetDate: targetDate.toISOString(),
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
        headerTitle={isEditMode ? "EDIT YOUR RESULTS" : "ENTER YOUR RESULTS"}
        onClose={() => router.back()}
        helpText={helpTitle}
        onHelpPress={() => setShowInfoModal(true)}
      >
        <UpdateResultsSectionLabel style={styles.sectionLabel}>
          LATEST MEASURE
        </UpdateResultsSectionLabel>
        <UpdateResultsTextInput
          value={latestMeasure}
          onChangeText={setLatestMeasure}
          placeholder="Enter measure"
          onSubmitEditing={Keyboard.dismiss}
          unit={unitLabel}
          containerStyle={styles.inputSpacing}
        />

        <UpdateResultsSectionLabel style={styles.sectionLabel}>
          DATE OF ACHIEVEMENT
        </UpdateResultsSectionLabel>
        <UpdateResultsDateCard
          value={formattedResultDate}
          onPress={() => {
            Keyboard.dismiss();
            setActivePicker("result");
          }}
        />

        {!isEditMode && (
          <>
            <UpdateResultsSectionLabel style={styles.sectionLabel}>
              {targetLabel}
            </UpdateResultsSectionLabel>
            <UpdateResultsTextInput
              value={targetValue}
              onChangeText={(value) => {
                setHasEditedTargetValue(true);
                setTargetValue(value);
              }}
              placeholder="0"
              onSubmitEditing={Keyboard.dismiss}
              unit={targetUnit}
              containerStyle={styles.inputSpacing}
            />
            <Text style={styles.helperText}>
              Always check your target is a healthy range for your age
            </Text>

            <UpdateResultsSectionLabel style={styles.sectionLabel}>
              TARGET DATE
            </UpdateResultsSectionLabel>
            <UpdateResultsDateCard
              value={formattedTargetDate}
              onPress={() => {
                Keyboard.dismiss();
                setActivePicker("target");
              }}
            />
          </>
        )}

        <UpdateResultsPrimaryButton
          label={isPending ? "Saving..." : "SAVE"}
          onPress={handleSave}
        />
      </UpdateResultsLayout>

      <DobPickerModal
        visible={activePicker === "result"}
        value={resultDate}
        onChange={handleResultDateChange}
        onClose={() => setActivePicker(null)}
        title="DATE OF ACHIEVEMENT"
        showTopBorder={false}
        maximumDate={resultMaxDate}
      />
      <DobPickerModal
        visible={activePicker === "target"}
        value={targetDate}
        onChange={handleTargetDateChange}
        onClose={() => setActivePicker(null)}
        title="TARGET DATE"
        showTopBorder={false}
        minimumDate={targetMinimumDate}
      />
      <BodyCompositionInfoModal
        visible={showInfoModal}
        title={infoContent.title}
        description={infoContent.description}
        targetRangeTitle={infoContent.targetRangeTitle}
        targetRangeSubtitle={infoContent.targetRangeSubtitle}
        ranges={infoContent.ranges}
        onClose={() => setShowInfoModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  sectionLabel: {
    marginBottom: 10,
  },
  inputSpacing: {
    marginBottom: 18,
  },
  helperText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 16,
    marginTop: -6,
    marginBottom: 18,
  },
});

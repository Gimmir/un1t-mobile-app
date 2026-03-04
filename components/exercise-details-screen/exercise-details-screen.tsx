import { ClassDetailsBottomCta } from "@/components/class-details-screen/bottom-cta";
import {
  ExerciseDetailsHeader,
  ExerciseHistorySection,
  ExerciseLatestResultCard,
  ExerciseScoreSection,
} from "@/components/exercise-details";
import { ExerciseTierInfoModal } from "@/components/exercise-details-screen/ExerciseTierInfoModal";
import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseFilterModal } from "./exercise-filter-modal";
import {
  CTA_HEIGHT,
  CTA_TOP_PADDING,
  REP_COUNTS,
  REP_TABS,
  type FilterOption,
} from "./exercise-details-data";
import { useExerciseScoreData } from "./use-exercise-score-data";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { usePerformanceSummary } from "@/src/features/performance/hooks/use-performance-summary";
import { usePerformanceHistory } from "@/src/features/performance/hooks/use-performance-history";
import { useDeletePerformanceLog } from "@/src/features/performance/hooks/use-delete-performance-log";
import { toPerformanceSlug } from "@/src/features/performance/utils/performance-slug";
import {
  calculateSquatScore,
  SQUAT_STANDARDS,
  type SquatGender,
} from "@/src/features/performance/utils/squat-score";
import {
  calculateDeadlift,
  DEADLIFT_STANDARDS,
} from "@/src/features/performance/utils/deadlift-score";
import {
  BENCH_STANDARDS,
  calculateBenchPress,
} from "@/src/features/performance/utils/bench-press-score";

const parseWeight = (weight?: string) => {
  if (!weight || typeof weight !== "string") {
    return { value: "--", unit: "KG" };
  }
  const trimmed = weight.trim();
  if (!trimmed) return { value: "--", unit: "KG" };
  const match = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]+)?/);
  if (!match) return { value: trimmed, unit: "" };
  return { value: match[1], unit: (match[2] ?? "KG").toUpperCase() };
};

const normalizeUnit = (unit?: string | null) => {
  if (!unit || typeof unit !== "string") return "";
  return unit.trim().toLowerCase();
};

const toKg = (value: number, unit?: string | null) => {
  const normalized = normalizeUnit(unit);
  if (["lb", "lbs", "pound", "pounds"].includes(normalized)) {
    return value * 0.45359237;
  }
  return value;
};

const resolveGenderKey = (user: unknown): SquatGender | null => {
  if (!user || typeof user !== "object") return null;
  const record = user as {
    gender?: unknown;
    sex?: unknown;
    profile?: { gender?: unknown; sex?: unknown };
    personalInfo?: { gender?: unknown; sex?: unknown };
  };
  const candidates = [
    record.gender,
    record.sex,
    record.profile?.gender,
    record.profile?.sex,
    record.personalInfo?.gender,
    record.personalInfo?.sex,
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const normalized = candidate.trim().toLowerCase();
    if (normalized === "male") return "male";
    if (normalized === "female") return "female";
    if (normalized.startsWith("m")) return "male";
    if (normalized.startsWith("f")) return "female";
  }
  return null;
};

const parseRepCountFromType = (value?: string) => {
  if (!value) return null;
  const match = value.trim().match(/^(\d+)/);
  if (!match) return null;
  const count = Number(match[1]);
  return Number.isFinite(count) ? count : null;
};

const resolveTypeForRepCount = (repCount: number, availableTypes: string[]) => {
  const matched = availableTypes.find(
    (type) => parseRepCountFromType(type) === repCount,
  );
  if (matched) return matched;
  return repCount === 1 ? "1-rep" : `${repCount}-reps`;
};

const toTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const HISTORY_START_DATE = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).toISOString();

type StrengthTier = "T1" | "T2" | "T3" | "T4" | "T5";
type StrengthStandardRow = {
  readonly bw: number;
  readonly beginner: number;
  readonly novice: number;
  readonly inter: number;
  readonly adv: number;
  readonly elite: number;
};

const resolveClosestStandard = (
  standards: readonly StrengthStandardRow[],
  bodyweight: number,
) =>
  standards.reduce((prev, curr) =>
    Math.abs(curr.bw - bodyweight) < Math.abs(prev.bw - bodyweight)
      ? curr
      : prev,
  );

const resolveStandardsByExercise = (
  exerciseSlug: string,
  gender: SquatGender,
): readonly StrengthStandardRow[] | null => {
  if (exerciseSlug === "squat") {
    return gender === "male" ? SQUAT_STANDARDS.male : SQUAT_STANDARDS.female;
  }
  if (exerciseSlug === "deadlift") {
    return gender === "male"
      ? DEADLIFT_STANDARDS.male
      : DEADLIFT_STANDARDS.female;
  }
  if (exerciseSlug === "bench_press") {
    return gender === "male" ? BENCH_STANDARDS.male : BENCH_STANDARDS.female;
  }
  return null;
};

const resolveNextTierTarget = (
  tier: StrengthTier,
  standards: StrengthStandardRow,
) => {
  if (tier === "T1") return { label: "Novice", target: standards.novice };
  if (tier === "T2") return { label: "Intermediate", target: standards.inter };
  if (tier === "T3") return { label: "Advanced", target: standards.adv };
  if (tier === "T4") return { label: "Elite", target: standards.elite };
  return null;
};

const formatKgDelta = (value: number) => {
  const normalized = Math.max(0, value);
  const rounded = Math.round(normalized * 10) / 10;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.0$/, "");
};

export function ExerciseDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, name, weight, slug, type } = useLocalSearchParams<{
    id?: string;
    name?: string;
    weight?: string;
    slug?: string;
    type?: string;
  }>();
  const initialTab = useMemo(() => {
    if (typeof type !== "string") return 0;
    const parsed = parseRepCountFromType(type);
    if (parsed) {
      const index = REP_COUNTS.indexOf(parsed as (typeof REP_COUNTS)[number]);
      if (index >= 0) return index;
    }
    const normalized = type.trim();
    if (normalized.startsWith("5")) return 2;
    if (normalized.startsWith("3")) return 1;
    return 0;
  }, [type]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isTierInfoModalVisible, setTierInfoModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Monthly");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [optimisticallyRemovedIds, setOptimisticallyRemovedIds] = useState<
    string[]
  >([]);
  const [historyEndDate, setHistoryEndDate] = useState(() =>
    new Date().toISOString(),
  );
  const isFocused = useIsFocused();
  const { data: user } = useAuth();
  const userId = user?._id ?? user?.id;
  const resolvedName =
    typeof name === "string" && name.trim().length > 0
      ? name
      : typeof id === "string"
        ? id.replace(/-/g, " ")
        : "Exercise";
  const resolvedSlug = useMemo(() => {
    if (typeof slug === "string" && slug.trim().length > 0) {
      return slug.trim();
    }
    if (typeof id === "string" && id.trim().length > 0) {
      return toPerformanceSlug(id);
    }
    return toPerformanceSlug(resolvedName);
  }, [slug, id, resolvedName]);
  const resolvedExerciseId = useMemo(() => {
    if (typeof id === "string" && id.trim().length > 0) return id;
    const slug = resolvedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return slug || "exercise";
  }, [id, resolvedName]);
  const repCount = REP_COUNTS[activeTab] ?? REP_COUNTS[0];
  const { data: summary } = usePerformanceSummary(userId);
  const availableTypes = useMemo(() => {
    const items = summary?.exercises ?? [];
    return items
      .filter(
        (item) => item.slug === resolvedSlug && typeof item.type === "string",
      )
      .map((item) => item.type);
  }, [summary, resolvedSlug]);
  const activeType = useMemo(
    () => resolveTypeForRepCount(repCount, availableTypes),
    [repCount, availableTypes],
  );
  const userGender = useMemo(() => resolveGenderKey(user), [user]);
  const userBodyweightKg = useMemo(() => {
    const measurements = summary?.measurements ?? [];
    const weightEntry =
      measurements.find((item) => item.slug === "weight") ??
      measurements.find((item) => item.type === "weight") ??
      measurements.find(
        (item) => item.name?.trim().toLowerCase() === "weight",
      );
    const latest = weightEntry?.latest;
    if (!latest || typeof latest.value !== "number") return null;
    const unit =
      latest.unit ?? (summary?.units === "imperial" ? "lb" : "kg");
    return toKg(latest.value, unit);
  }, [summary]);
  const routeRepCount = useMemo(
    () => parseRepCountFromType(typeof type === "string" ? type : undefined),
    [type],
  );
  const canUseRouteWeight = routeRepCount === repCount;

  const latestEntry = useMemo(() => {
    const items = summary?.exercises ?? [];
    return (
      items.find(
        (item) => item.slug === resolvedSlug && item.type === activeType,
      ) ??
      items.find(
        (item) =>
          item.slug === resolvedSlug &&
          parseRepCountFromType(item.type) === repCount,
      ) ??
      items.find(
        (item) =>
          parseRepCountFromType(item.type) === repCount &&
          item.name?.trim().toLowerCase() ===
            resolvedName.trim().toLowerCase(),
      )
    );
  }, [summary, resolvedSlug, activeType, repCount, resolvedName]);

  const latestWeight = useMemo(() => {
    const latest = latestEntry?.latest;
    if (!latest || typeof latest.value !== "number") {
      return canUseRouteWeight ? weight : undefined;
    }
    const fallbackUnit = summary?.units === "imperial" ? "LB" : "KG";
    const unit = latest.unit ? latest.unit.toUpperCase() : fallbackUnit;
    const value = Number.isInteger(latest.value)
      ? String(latest.value)
      : String(latest.value);
    return unit ? `${value} ${unit}` : value;
  }, [latestEntry, summary?.units, weight, canUseRouteWeight]);

  const liftedWeightKg = useMemo(() => {
    const latest = latestEntry?.latest;
    if (!latest || typeof latest.value !== "number") return null;
    const unit = latest.unit ?? (summary?.units === "imperial" ? "lb" : "kg");
    return toKg(latest.value, unit);
  }, [latestEntry, summary?.units]);

  const strengthScore = useMemo(() => {
    const liftedWeight =
      typeof liftedWeightKg === "number" ? liftedWeightKg : null;
    const bodyweight =
      typeof userBodyweightKg === "number" ? userBodyweightKg : null;

    if (liftedWeight === null || !Number.isFinite(liftedWeight) || liftedWeight <= 0) {
      return null;
    }
    if (bodyweight === null || !Number.isFinite(bodyweight) || bodyweight <= 0) {
      return null;
    }
    if (!userGender) return null;
    if (resolvedSlug === "squat") {
      return calculateSquatScore(
        liftedWeight,
        repCount,
        bodyweight,
        userGender,
      );
    }
    if (resolvedSlug === "deadlift") {
      return calculateDeadlift(
        liftedWeight,
        repCount,
        bodyweight,
        userGender,
      );
    }
    if (resolvedSlug === "bench_press") {
      return calculateBenchPress(
        liftedWeight,
        repCount,
        bodyweight,
        userGender,
      );
    }
    return null;
  }, [resolvedSlug, liftedWeightKg, userBodyweightKg, userGender, repCount]);
  const supportsAssessment = useMemo(
    () => ["squat", "deadlift", "bench_press"].includes(resolvedSlug),
    [resolvedSlug],
  );
  const needsBodyCompositionParams =
    supportsAssessment &&
    (!userGender ||
      !Number.isFinite(userBodyweightKg) ||
      (userBodyweightKg ?? 0) <= 0);
  const missingAssessmentHint = needsBodyCompositionParams
    ? "To display Your Assessment and TIER, enter your body composition parameters first."
    : undefined;

  const resolvedWeight = useMemo(() => parseWeight(latestWeight), [latestWeight]);
  const bottomCtaPadding = Math.max(14, insets.bottom + 14);
  const bottomPadding = bottomCtaPadding + CTA_HEIGHT + CTA_TOP_PADDING;
  const headerPaddingTop = insets.top + 12;
  const contentTopPadding = (headerHeight || 0) + 12;

  const { chartData, maxValue } = useExerciseScoreData({
    selectedFilter,
    userId,
    slug: resolvedSlug,
    type: activeType,
    referenceDate: latestEntry?.latest?.date ?? null,
  });
  const { data: historyData, isLoading: isHistoryLoading } = usePerformanceHistory(
    {
      userId,
      slug: resolvedSlug,
      type: activeType,
      startDate: HISTORY_START_DATE,
      endDate: historyEndDate,
    },
  );
  const { mutate: deletePerformanceLog } = useDeletePerformanceLog();
  const sortedHistory = useMemo(
    () =>
      [...(historyData ?? [])].sort(
        (a, b) => toTimestamp(b.date) - toTimestamp(a.date),
      ),
    [historyData],
  );
  const visibleHistory = useMemo(
    () =>
      sortedHistory.filter(
        (entry) => !optimisticallyRemovedIds.includes(entry._id),
      ),
    [sortedHistory, optimisticallyRemovedIds],
  );

  useEffect(() => {
    if (!isFocused) return;
    setHistoryEndDate(new Date().toISOString());
  }, [isFocused]);

  useEffect(() => {
    setOptimisticallyRemovedIds([]);
    setDeletingEntryId(null);
    setTierInfoModalVisible(false);
  }, [resolvedSlug, activeType]);

  useEffect(() => {
    if (optimisticallyRemovedIds.length === 0) return;
    const serverIds = new Set((historyData ?? []).map((entry) => entry._id));
    const next = optimisticallyRemovedIds.filter((id) => serverIds.has(id));
    if (next.length !== optimisticallyRemovedIds.length) {
      setOptimisticallyRemovedIds(next);
    }
  }, [historyData, optimisticallyRemovedIds]);

  const handleFilterSelect = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  }, []);

  const handleUpdateResultsPress = useCallback(() => {
    router.push({
      pathname: "/exercise-details/[id]/update-results",
      params: {
        id: resolvedExerciseId,
        reps: String(repCount),
        name: resolvedName,
      },
    });
  }, [repCount, resolvedExerciseId, resolvedName, router]);

  const handleEditHistoryEntry = useCallback(
    (entry: { _id: string; value: unknown; unit?: string; date: string }) => {
      const rawValue =
        typeof entry.value === "number"
          ? String(entry.value)
          : typeof entry.value === "string"
            ? entry.value
            : "";
      router.push({
        pathname: "/exercise-details/[id]/update-results",
        params: {
          id: resolvedExerciseId,
          name: resolvedName,
          editEntryId: entry._id,
          editValue: rawValue,
          editDate: entry.date,
          editReps: String(repCount),
        },
      });
    },
    [resolvedExerciseId, resolvedName, repCount, router],
  );

  const handleDeleteHistoryEntry = useCallback(
    (entryId: string) => {
      Alert.alert(
        "Delete entry",
        "This record will be permanently removed.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setOptimisticallyRemovedIds((current) =>
                current.includes(entryId) ? current : [...current, entryId],
              );
              setDeletingEntryId(entryId);
              deletePerformanceLog(entryId, {
                onSuccess: () => {
                  setDeletingEntryId((current) =>
                    current === entryId ? null : current,
                  );
                },
                onError: (error) => {
                  setOptimisticallyRemovedIds((current) =>
                    current.filter((id) => id !== entryId),
                  );
                  setDeletingEntryId((current) =>
                    current === entryId ? null : current,
                  );
                  Alert.alert(
                    "Unable to delete entry",
                    error.message || "Please try again.",
                  );
                },
              });
            },
          },
        ],
      );
    },
    [deletePerformanceLog],
  );

  const handleHeaderLayout = (event: {
    nativeEvent: { layout: { height: number } };
  }) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    if (nextHeight !== headerHeight) {
      setHeaderHeight(nextHeight);
    }
  };

  const handleOpenTierInfoModal = useCallback(
    () => setTierInfoModalVisible(true),
    [],
  );
  const handleCloseTierInfoModal = useCallback(
    () => setTierInfoModalVisible(false),
    [],
  );

  const tierInfoDescription = useMemo(() => {
    if (!supportsAssessment) {
      return "Tier explanations are available for Squat, Deadlift, and Bench Press.";
    }
    if (needsBodyCompositionParams) {
      return "To display your category and next tier target, first enter your body composition parameters.";
    }
    if (!strengthScore || !userGender) {
      return "Add a valid result to view your current category and next tier target.";
    }
    const bodyweightForTier =
      typeof userBodyweightKg === "number" ? userBodyweightKg : null;
    if (
      bodyweightForTier === null ||
      !Number.isFinite(bodyweightForTier) ||
      bodyweightForTier <= 0
    ) {
      return "Add your bodyweight in Body Composition to unlock tier progression details.";
    }

    const standardsTable = resolveStandardsByExercise(resolvedSlug, userGender);
    if (!standardsTable || standardsTable.length === 0) {
      return "Tier progression details are currently unavailable for this exercise.";
    }

    const standards = resolveClosestStandard(standardsTable, bodyweightForTier);
    const nextTier = resolveNextTierTarget(strengthScore.tier, standards);
    if (!nextTier) {
      return `Your current value puts you in the ${strengthScore.label} category. You are already in the highest tier.`;
    }

    const increaseKg = Math.max(0, nextTier.target - strengthScore.oneRepMax);
    return `Your current value puts you in the ${strengthScore.label} category, an increase of ${formatKgDelta(increaseKg)} kg will move you to ${nextTier.label}.`;
  }, [
    supportsAssessment,
    needsBodyCompositionParams,
    strengthScore,
    userGender,
    userBodyweightKg,
    resolvedSlug,
  ]);

  const resultMetaItems = useMemo(
    () => [
      {
        key: "score",
        label: "SCORE",
        value: strengthScore ? String(strengthScore.score) : "--",
        flex: 1,
      },
      {
        key: "tier",
        label: "TIER",
        value: strengthScore ? strengthScore.label : "--",
        onInfoPress: handleOpenTierInfoModal,
        flex: 1,
      },
    ],
    [strengthScore, handleOpenTierInfoModal],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.safeArea}>
        <ExerciseDetailsHeader
          title={resolvedName}
          tabs={REP_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onBack={() => router.back()}
          paddingTop={headerPaddingTop}
          onLayout={handleHeaderLayout}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: contentTopPadding, paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ExerciseLatestResultCard
            weightValue={resolvedWeight.value}
            weightUnit={resolvedWeight.unit}
            metaItems={resultMetaItems}
            missingDataHint={missingAssessmentHint}
          />

          <ExerciseScoreSection
            selectedFilter={selectedFilter}
            onFilterPress={() => setShowFilterModal(true)}
            chartData={chartData}
            maxValue={maxValue}
            unitLabel={resolvedWeight.unit}
          />
          <ExerciseHistorySection
            entries={visibleHistory}
            fallbackUnit={resolvedWeight.unit}
            repCount={repCount}
            isLoading={isHistoryLoading}
            deletingEntryId={deletingEntryId}
            onDeleteEntry={handleDeleteHistoryEntry}
            onEditEntry={handleEditHistoryEntry}
          />
        </ScrollView>
        <ClassDetailsBottomCta
          paddingBottom={bottomCtaPadding}
          disabled={false}
          isCancel={false}
          backgroundColor="#FFFFFF"
          borderColor="#FFFFFF"
          textColor="#000000"
          label="UPDATE RESULTS"
          onPress={handleUpdateResultsPress}
          buttonStyle={styles.bottomCtaButtonCompact}
          textStyle={styles.bottomCtaTextCompact}
        />

        <ExerciseFilterModal
          visible={showFilterModal}
          selectedFilter={selectedFilter}
          onSelect={handleFilterSelect}
          onClose={() => setShowFilterModal(false)}
        />
        <ExerciseTierInfoModal
          visible={isTierInfoModalVisible}
          currentTier={strengthScore?.label}
          description={tierInfoDescription}
          onClose={handleCloseTierInfoModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  bottomCtaButtonCompact: {
    height: CTA_HEIGHT,
    borderRadius: 8,
  },
  bottomCtaTextCompact: {
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.heavy,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
  },
});

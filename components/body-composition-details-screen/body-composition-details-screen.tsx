import { ClassDetailsBottomCta } from "@/components/class-details-screen/bottom-cta";
import {
  ExerciseDetailsHeader,
  ExerciseHistorySection,
  ExerciseLatestResultCard,
  ExerciseScoreSection,
} from "@/components/exercise-details";
import { ExerciseFilterModal } from "@/components/exercise-details-screen/exercise-filter-modal";
import {
  CTA_HEIGHT,
  CTA_TOP_PADDING,
  type FilterOption,
} from "@/components/exercise-details-screen/exercise-details-data";
import { useExerciseScoreData } from "@/components/exercise-details-screen/use-exercise-score-data";
import {
  normalizeUnit,
  resolveBodyCompositionMetric,
  resolveBodyCompositionTitle,
  slugifyMetric,
} from "@/components/body-composition-details-screen/body-composition-utils";
import {
  formatTargetDate,
  parseTargetDate,
} from "@/components/body-composition-details-screen/body-composition-update-results.utils";
import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useDeletePerformanceLog } from "@/src/features/performance/hooks/use-delete-performance-log";
import { usePerformanceHistory } from "@/src/features/performance/hooks/use-performance-history";
import { usePerformanceSummary } from "@/src/features/performance/hooks/use-performance-summary";
import { toPerformanceSlug } from "@/src/features/performance/utils/performance-slug";
import {
  resolveTargetDate,
  resolveTargetValue,
} from "@/src/features/performance/utils/performance-target";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HISTORY_START_DATE = new Date(
  Date.UTC(2000, 0, 1, 0, 0, 0, 0),
).toISOString();

const toTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export function BodyCompositionDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuth();
  const userId = user?._id ?? user?.id;
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
  const { id, label, slug, type } = useLocalSearchParams<{
    id?: string;
    label?: string;
    slug?: string;
    type?: string;
  }>();

  const metric = useMemo(
    () => resolveBodyCompositionMetric(id, label),
    [id, label],
  );
  const resolvedSlug = useMemo(() => {
    if (typeof slug === "string" && slug.trim()) return slug.trim();
    if (metric?.slug) return metric.slug;
    if (metric?.detailTitle) return toPerformanceSlug(metric.detailTitle);
    if (metric?.label) return toPerformanceSlug(metric.label);
    if (typeof id === "string" && id.trim()) return toPerformanceSlug(id);
    return "measurement";
  }, [slug, metric, id]);
  const fallbackType =
    (typeof type === "string" && type.trim() ? type.trim() : undefined) ??
    metric?.type ??
    resolvedSlug;
  const { data: summary } = usePerformanceSummary(userId);
  const matchedMeasurement = useMemo(() => {
    const list = summary?.measurements ?? [];
    if (!list.length) return undefined;
    const slugAliases =
      metric?.id === "waist"
        ? [resolvedSlug, "waist", "waist_circumference"]
        : [resolvedSlug];
    return (
      list.find((item) => slugAliases.includes(item.slug ?? "")) ??
      list.find(
        (item) =>
          item.name?.trim().toLowerCase() ===
          (metric?.detailTitle ?? metric?.label ?? "").trim().toLowerCase(),
      )
    );
  }, [summary, resolvedSlug, metric]);
  const resolvedType = useMemo(
    () => matchedMeasurement?.type ?? fallbackType,
    [matchedMeasurement, fallbackType],
  );
  const mergedMetric = useMemo(() => {
    if (!metric) return metric;
    const latest = matchedMeasurement?.latest;
    const targetValue = resolveTargetValue(matchedMeasurement);
    const targetDate = resolveTargetDate(matchedMeasurement);

    const nextCurrent =
      latest && typeof latest.value === "number"
        ? {
            value: Number.isInteger(latest.value)
              ? String(latest.value)
              : String(latest.value),
            unit: latest.unit ?? metric.current?.unit,
          }
        : metric.current;

    return {
      ...metric,
      current: nextCurrent,
      target: {
        ...metric.target,
        value: targetValue ?? metric.target?.value,
      },
      targetDate: targetDate ?? metric.targetDate,
    };
  }, [metric, matchedMeasurement]);
  const resolvedTitle = useMemo(
    () =>
      resolveBodyCompositionTitle(
        mergedMetric,
        typeof label === "string" ? label : undefined,
      ),
    [mergedMetric, label],
  );
  const resolvedId = useMemo(() => {
    if (mergedMetric?.id) return mergedMetric.id;
    if (typeof id === "string" && id.trim()) return id;
    return slugifyMetric(resolvedTitle);
  }, [mergedMetric, id, resolvedTitle]);

  const latestValue = mergedMetric?.current.value ?? "--";
  const latestUnit = normalizeUnit(mergedMetric?.current.unit);
  const targetValue = mergedMetric?.target.value ?? "--";
  const targetUnit = normalizeUnit(mergedMetric?.target.unit);
  const targetDate = useMemo(() => {
    const raw = mergedMetric?.targetDate;
    if (typeof raw === "string" && raw.trim()) {
      return formatTargetDate(parseTargetDate(raw));
    }
    return "--";
  }, [mergedMetric?.targetDate]);

  const bottomCtaPadding = Math.max(14, insets.bottom + 14);
  const bottomPadding = bottomCtaPadding + CTA_HEIGHT + CTA_TOP_PADDING;
  const headerPaddingTop = insets.top + 12;
  const contentTopPadding = (headerHeight || 0) + 12;

  const { chartData, maxValue } = useExerciseScoreData({
    selectedFilter,
    userId,
    slug: resolvedSlug,
    type: resolvedType,
    referenceDate: matchedMeasurement?.latest?.date ?? null,
  });
  const { data: historyData, isLoading: isHistoryLoading } = usePerformanceHistory(
    {
      userId,
      slug: resolvedSlug,
      type: resolvedType,
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
  }, [resolvedSlug, resolvedType]);

  useEffect(() => {
    if (optimisticallyRemovedIds.length === 0) return;
    const serverIds = new Set((historyData ?? []).map((entry) => entry._id));
    const next = optimisticallyRemovedIds.filter((entryId) =>
      serverIds.has(entryId),
    );
    if (next.length !== optimisticallyRemovedIds.length) {
      setOptimisticallyRemovedIds(next);
    }
  }, [historyData, optimisticallyRemovedIds]);

  const handleHeaderLayout = (event: {
    nativeEvent: { layout: { height: number } };
  }) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    if (nextHeight !== headerHeight) {
      setHeaderHeight(nextHeight);
    }
  };

  const handleUpdateMeasurePress = useCallback(() => {
    router.push({
      pathname: "/body-composition/[id]/update-results",
      params: { id: resolvedId, label: resolvedTitle },
    });
  }, [resolvedId, resolvedTitle, router]);

  const handleEditHistoryEntry = useCallback(
    (entry: { _id: string; value: unknown; unit?: string; date: string }) => {
      const rawValue =
        typeof entry.value === "number"
          ? String(entry.value)
          : typeof entry.value === "string"
            ? entry.value
            : "";
      router.push({
        pathname: "/body-composition/[id]/update-results",
        params: {
          id: resolvedId,
          label: resolvedTitle,
          editEntryId: entry._id,
          editValue: rawValue,
          editDate: entry.date,
        },
      });
    },
    [resolvedId, resolvedTitle, router],
  );

  const handleFilterSelect = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  }, []);

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.safeArea}>
        <ExerciseDetailsHeader
          title={resolvedTitle}
          onBack={() => router.back()}
          paddingTop={headerPaddingTop}
          onLayout={handleHeaderLayout}
          showTabs={false}
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
            weightValue={latestValue}
            weightUnit={latestUnit}
            metaItems={[
              {
                key: "target",
                label: "YOUR TARGET",
                value: targetValue,
                unit: targetUnit,
                flex: 1,
              },
              {
                key: "date",
                label: "TARGET DATE",
                value: targetDate,
                flex: 1,
              },
            ]}
          />

          <ExerciseScoreSection
            selectedFilter={selectedFilter}
            onFilterPress={() => setShowFilterModal(true)}
            chartData={chartData}
            maxValue={maxValue}
            unitLabel={latestUnit}
          />
          <ExerciseHistorySection
            entries={visibleHistory}
            fallbackUnit={latestUnit}
            entryLabel="Measure"
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
          label="UPDATE MEASURE"
          onPress={handleUpdateMeasurePress}
          buttonStyle={styles.bottomCtaButtonCompact}
          textStyle={styles.bottomCtaTextCompact}
        />

        <ExerciseFilterModal
          visible={showFilterModal}
          selectedFilter={selectedFilter}
          onSelect={handleFilterSelect}
          onClose={() => setShowFilterModal(false)}
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

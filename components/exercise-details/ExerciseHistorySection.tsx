import React, { useMemo } from "react";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";

type ExerciseHistoryEntry = {
  _id: string;
  value: unknown;
  unit?: string;
  date: string;
};

type ExerciseHistorySectionProps = {
  entries?: ExerciseHistoryEntry[];
  fallbackUnit?: string;
  repCount?: number;
  entryLabel?: string;
  isLoading?: boolean;
  deletingEntryId?: string | null;
  onDeleteEntry?: (entryId: string) => void;
  onEditEntry?: (entry: ExerciseHistoryEntry) => void;
};

const formatHistoryValue = (value: unknown) => {
  if (typeof value === "string") {
    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      value = parsed;
    } else {
      return value.trim() || "--";
    }
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return "--";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace(/\.0$/, "");
};

const formatHistoryDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "--", time: "--" };
  return {
    date: format(date, "dd MMM yyyy"),
    time: format(date, "HH:mm"),
  };
};

const resolveRepLabel = (repCount: number) =>
  repCount === 1 ? "1 REP" : `${repCount} REPS`;

const rowLayoutTransition = LinearTransition.duration(180);

export function ExerciseHistorySection({
  entries,
  fallbackUnit,
  repCount = 1,
  entryLabel,
  isLoading = false,
  deletingEntryId,
  onDeleteEntry,
  onEditEntry,
}: ExerciseHistorySectionProps) {
  const list = useMemo(() => entries ?? [], [entries]);
  const unitLabel =
    typeof fallbackUnit === "string" && fallbackUnit.trim()
      ? fallbackUnit.trim().toUpperCase()
      : "KG";
  const repLabel =
    typeof entryLabel === "string" && entryLabel.trim()
      ? entryLabel.trim().toUpperCase()
      : resolveRepLabel(repCount);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>HISTORY</Text>
        {!isLoading ? (
          <Text style={styles.sectionCount}>{list.length}</Text>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Loading history...</Text>
        </View>
      ) : null}

      {!isLoading && list.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No entries yet.</Text>
        </View>
      ) : null}

      {!isLoading &&
        list.map((entry) => {
          const timestamp = formatHistoryDate(entry.date);
          const entryUnit =
            typeof entry.unit === "string" && entry.unit.trim()
              ? entry.unit.trim().toUpperCase()
              : unitLabel;
          const isDeleting = deletingEntryId === entry._id;
          const canDelete = Boolean(onDeleteEntry);
          const canEdit = Boolean(onEditEntry);
          const card = (
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.repBadge}>{repLabel}</Text>
                <Text style={styles.cardDate}>{timestamp.date}</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardBottomRow}>
                <View style={styles.valueRow}>
                  <Text style={styles.cardValue}>
                    {formatHistoryValue(entry.value)}
                  </Text>
                  <Text style={styles.cardUnit}>{entryUnit}</Text>
                </View>
                <Text style={styles.cardTime}>{timestamp.time}</Text>
              </View>
            </View>
          );

          if (!canDelete && !canEdit) {
            return (
              <Animated.View
                key={entry._id}
                style={styles.rowWrapper}
                layout={rowLayoutTransition}
              >
                <View style={styles.row}>{card}</View>
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={entry._id}
              style={styles.rowWrapper}
              layout={rowLayoutTransition}
            >
              <Swipeable
                enabled={!isDeleting}
                overshootRight={false}
                rightThreshold={40}
                renderRightActions={() => (
                  <View style={[styles.swipeActionsContainer, canEdit && canDelete && styles.swipeActionsContainerWide]}>
                    {canEdit && (
                      <TouchableOpacity
                        style={styles.editActionButton}
                        activeOpacity={0.8}
                        onPress={() => onEditEntry?.(entry)}
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={18}
                          color="#60A5FA"
                        />
                        <Text style={styles.editActionText}>EDIT</Text>
                      </TouchableOpacity>
                    )}
                    {canDelete && (
                      <TouchableOpacity
                        style={[
                          styles.deleteActionButton,
                          isDeleting && styles.deleteActionButtonDisabled,
                        ]}
                        disabled={isDeleting}
                        activeOpacity={0.8}
                        onPress={() => onDeleteEntry?.(entry._id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#F87171"
                        />
                        <Text style={styles.deleteActionText}>
                          {isDeleting ? "..." : "DELETE"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              >
                <View style={styles.row}>{card}</View>
              </Swipeable>
            </Animated.View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 1.5,
  },
  sectionCount: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.heavy,
    fontFamily: typography.fontFamily.heavy,
    letterSpacing: 1,
  },
  rowWrapper: {
    marginBottom: 10,
  },
  row: {
    borderRadius: 6,
    overflow: "hidden",
  },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1C1C1F",
    backgroundColor: "#111113",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  repBadge: {
    color: "#FFFFFF",
    fontSize: typography.size.xs,
    fontWeight: typography.weight.heavy,
    fontFamily: typography.fontFamily.heavy,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  cardDate: {
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.4,
  },
  cardDivider: {
    height: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.surface.panel,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    fontFamily: typography.fontFamily.heavy,
    lineHeight: 24,
    letterSpacing: 0.6,
  },
  cardUnit: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.bold,
    marginLeft: 8,
    marginBottom: 2,
    letterSpacing: 0.6,
  },
  cardTime: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  emptyCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1C1C1F",
    backgroundColor: "#111113",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.3,
  },
  swipeActionsContainer: {
    width: 100,
    alignSelf: "stretch",
    flexDirection: "row",
    paddingLeft: 6,
    gap: 6,
  },
  swipeActionsContainerWide: {
    width: 200,
  },
  editActionButton: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1C1C1F",
    backgroundColor: "#111113",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,
  },
  editActionText: {
    color: "#60A5FA",
    fontSize: typography.size.xs,
    fontWeight: typography.weight.heavy,
    fontFamily: typography.fontFamily.heavy,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  deleteActionButton: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1C1C1F",
    backgroundColor: "#111113",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,
  },
  deleteActionButtonDisabled: {
    opacity: 0.7,
  },
  deleteActionText: {
    color: "#F87171",
    fontSize: typography.size.xs,
    fontWeight: typography.weight.heavy,
    fontFamily: typography.fontFamily.heavy,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

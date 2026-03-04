import { colors } from "@/src/theme/colors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

// ─── Base pulse block ────────────────────────────────────────────────────────

function SkeletonBox({
  width,
  height,
  borderRadius = 6,
  style,
  opacity,
}: {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
  opacity: Animated.Value;
}) {
  return (
    <Animated.View
      style={[
        {
          width: width ?? "100%",
          height,
          borderRadius,
          backgroundColor: colors.surface.elevated,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Individual skeleton blocks ───────────────────────────────────────────────

function CreditCardSkeleton({ opacity }: { opacity: Animated.Value }) {
  return (
    <View style={s.creditCard}>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <View style={s.creditCol}>
            <SkeletonBox height={10} width="60%" borderRadius={4} opacity={opacity} />
            <SkeletonBox height={18} width="80%" borderRadius={4} style={{ marginTop: 10 }} opacity={opacity} />
          </View>
          {i < 2 && <View style={s.creditDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

function EventCardSkeleton({ opacity }: { opacity: Animated.Value }) {
  return (
    <View style={s.eventCard}>
      <SkeletonBox height={10} width="40%" borderRadius={4} opacity={opacity} />
      <View style={[s.eventInner, { marginTop: 12 }]}>
        <SkeletonBox width={56} height={56} borderRadius={6} opacity={opacity} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <SkeletonBox height={12} width="70%" borderRadius={4} opacity={opacity} />
          <SkeletonBox height={10} width="50%" borderRadius={4} opacity={opacity} />
          <SkeletonBox height={10} width="40%" borderRadius={4} opacity={opacity} />
        </View>
      </View>
    </View>
  );
}

function ExerciseRowSkeleton({ opacity }: { opacity: Animated.Value }) {
  return (
    <View style={s.exerciseRow}>
      <SkeletonBox width={72} height={72} borderRadius={4} opacity={opacity} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <SkeletonBox height={14} width="55%" borderRadius={4} opacity={opacity} />
        <SkeletonBox height={10} width="30%" borderRadius={4} opacity={opacity} />
        <SkeletonBox height={14} width="40%" borderRadius={4} opacity={opacity} />
      </View>
    </View>
  );
}

function CompositionCardSkeleton({
  width,
  opacity,
}: {
  width: number;
  opacity: Animated.Value;
}) {
  return (
    <View style={[s.compositionCard, { width }]}>
      <SkeletonBox width={48} height={48} borderRadius={8} opacity={opacity} />
      <SkeletonBox height={14} width="80%" borderRadius={4} style={{ marginTop: 24 }} opacity={opacity} />
      <View style={[s.compositionMeta]}>
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox height={9} width="60%" borderRadius={3} opacity={opacity} />
          <SkeletonBox height={14} width="70%" borderRadius={4} opacity={opacity} />
        </View>
        <View style={{ flex: 1, alignItems: "flex-end", gap: 6 }}>
          <SkeletonBox height={9} width="60%" borderRadius={3} opacity={opacity} />
          <SkeletonBox height={14} width="70%" borderRadius={4} opacity={opacity} />
        </View>
      </View>
    </View>
  );
}

function SectionLabelSkeleton({ opacity }: { opacity: Animated.Value }) {
  return (
    <SkeletonBox height={11} width="35%" borderRadius={4} style={{ marginLeft: 4, marginBottom: 10 }} opacity={opacity} />
  );
}

// ─── Full skeleton ────────────────────────────────────────────────────────────

export function HomeSkeletonLoader() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32) * 0.6;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={s.container}>
      {/* Hero */}
      <View style={s.hero}>
        <SkeletonBox height={22} width="60%" borderRadius={5} opacity={opacity} />
        <SkeletonBox height={13} width="40%" borderRadius={4} style={{ marginTop: 10 }} opacity={opacity} />
      </View>

      {/* Credits */}
      <CreditCardSkeleton opacity={opacity} />

      {/* Next event */}
      <View style={s.section}>
        <EventCardSkeleton opacity={opacity} />
      </View>

      {/* 1 REP MAX */}
      <View style={s.section}>
        <SectionLabelSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
      </View>

      {/* BODY COMPOSITION */}
      <View style={s.section}>
        <SectionLabelSkeleton opacity={opacity} />
        <View style={s.compositionRow}>
          <CompositionCardSkeleton width={cardWidth} opacity={opacity} />
          <CompositionCardSkeleton width={cardWidth} opacity={opacity} />
        </View>
      </View>
    </View>
  );
}

// ─── Performance-only skeleton (for sections below) ──────────────────────────

export function PerformanceSkeletonLoader() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32) * 0.6;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View>
      <View style={s.section}>
        <SectionLabelSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
        <ExerciseRowSkeleton opacity={opacity} />
      </View>
      <View style={s.section}>
        <SectionLabelSkeleton opacity={opacity} />
        <View style={s.compositionRow}>
          <CompositionCardSkeleton width={cardWidth} opacity={opacity} />
          <CompositionCardSkeleton width={cardWidth} opacity={opacity} />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 0,
  },
  creditCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  creditCol: {
    flex: 1,
  },
  creditDivider: {
    width: 1,
    backgroundColor: colors.surface.elevated,
    marginHorizontal: 14,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 22,
  },
  eventCard: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
  },
  eventInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
  },
  compositionRow: {
    flexDirection: "row",
    gap: 12,
    overflow: "hidden",
  },
  compositionCard: {
    minHeight: 190,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
  },
  compositionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { HexagonAvatar } from '@/components/classes';
import { SwipeToConfirm } from './swipe-to-confirm';
import Svg, { Polygon } from 'react-native-svg';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

const PANEL_PADDING = 16;

type ConfirmBookingModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onAddToCalendar?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  resetKey?: number;
  eventName: string;
  coachName: string;
  coachAvatarUri: string;
  coachHasAvatar?: boolean;
  eventDateLabel: string;
  startTimeLabel: string;
  durationMinutes: number | null;
  creditCost: number | null;
  availableCredits?: number | null;
};

function formatCredits(cost: number) {
  if (cost === 1) return '1 CREDIT';
  return `${cost} CREDITS`;
}

export function ConfirmBookingModal({
  visible,
  onClose,
  onConfirm,
  onAddToCalendar,
  isSubmitting,
  errorMessage,
  resetKey,
  eventName,
  coachName,
  coachAvatarUri,
  coachHasAvatar,
  eventDateLabel,
  startTimeLabel,
  durationMinutes,
  creditCost,
  availableCredits,
}: ConfirmBookingModalProps) {
  const [didAttemptConfirm, setDidAttemptConfirm] = useState(false);
  const [mode, setMode] = useState<'confirm' | 'success'>('confirm');
  const [showConfirmPanel, setShowConfirmPanel] = useState(true);
  const transition = useRef(new Animated.Value(0)).current;
  const { height: windowHeight } = useWindowDimensions();
  const resolvedCreditCost = creditCost ?? 1;
  const availableCreditsValue =
    typeof availableCredits === 'number' ? availableCredits : null;
  const hasUnlimitedCredits = availableCreditsValue === Number.POSITIVE_INFINITY;
  const insufficientCredits =
    !hasUnlimitedCredits &&
    availableCreditsValue != null &&
    Number.isFinite(availableCreditsValue) &&
    resolvedCreditCost > availableCreditsValue;

  const confirmCardHeight = useMemo(() => {
    const maxHeight = Math.min(windowHeight * 0.86, 640);
    return Math.max(500, Math.min(560, maxHeight));
  }, [windowHeight]);

  const successCardHeight = useMemo(() => {
    const maxHeight = Math.min(windowHeight * 0.86, 640);
    return Math.max(360, Math.min(420, maxHeight));
  }, [windowHeight]);

  const cardHeight = useRef(new Animated.Value(confirmCardHeight)).current;
  const lastMeasuredSuccessHeight = useRef<number | null>(null);
  const lastMeasuredConfirmHeight = useRef<number | null>(null);

  const creditsText = `You will be charged -${formatCredits(resolvedCreditCost)}`;
  const creditsErrorMessage = insufficientCredits
    ? 'Not enough credits to book this class.'
    : errorMessage;

  const durationText = useMemo(() => {
    if (durationMinutes == null) return '—';
    return `${durationMinutes} min`;
  }, [durationMinutes]);

  useEffect(() => {
    if (!visible) {
      setDidAttemptConfirm(false);
      setMode('confirm');
      setShowConfirmPanel(true);
      transition.setValue(0);
      cardHeight.setValue(confirmCardHeight);
      lastMeasuredSuccessHeight.current = null;
      lastMeasuredConfirmHeight.current = null;
    }
  }, [cardHeight, confirmCardHeight, transition, visible]);

  useEffect(() => {
    if (!visible) return;
    if (mode !== 'confirm') return;
    setShowConfirmPanel(true);
    cardHeight.setValue(confirmCardHeight);
  }, [cardHeight, confirmCardHeight, mode, visible]);

  const handleConfirmLayout = useCallback(
    (measuredHeight: number) => {
      if (!measuredHeight || mode !== 'confirm' || !visible) return;

      const contentHeight = Math.ceil(measuredHeight);
      if (lastMeasuredConfirmHeight.current === contentHeight) return;
      lastMeasuredConfirmHeight.current = contentHeight;

      const target = Math.max(360, Math.min(contentHeight + PANEL_PADDING * 2, confirmCardHeight));
      Animated.spring(cardHeight, {
        toValue: target,
        useNativeDriver: false,
        bounciness: 0,
        speed: 18,
      }).start();
    },
    [cardHeight, confirmCardHeight, mode, visible]
  );

  useEffect(() => {
    if (!visible) return;
    if (mode === 'success') return;
    if (!didAttemptConfirm) return;
    if (isSubmitting) return;
    if (errorMessage) return;

    setMode('success');
    Animated.timing(transition, {
      toValue: 1,
      duration: 260,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) setShowConfirmPanel(false);
    });
    Animated.spring(cardHeight, {
      toValue: successCardHeight,
      useNativeDriver: false,
      bounciness: 0,
      speed: 18,
    }).start();
  }, [cardHeight, didAttemptConfirm, errorMessage, isSubmitting, mode, successCardHeight, transition, visible]);

  const handleSuccessLayout = useCallback(
    (measuredHeight: number) => {
      if (!measuredHeight || mode !== 'success') return;

      const contentHeight = Math.ceil(measuredHeight);
      if (lastMeasuredSuccessHeight.current === contentHeight) return;
      lastMeasuredSuccessHeight.current = contentHeight;

      const target = Math.max(320, Math.min(contentHeight + PANEL_PADDING * 2, successCardHeight));
      Animated.spring(cardHeight, {
        toValue: target,
        useNativeDriver: false,
        bounciness: 0,
        speed: 18,
      }).start();
    },
    [cardHeight, mode, successCardHeight]
  );

  const confirmOpacity = transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const successOpacity = transition;
  const confirmScale = transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] });
  const successScale = transition.interpolate({ inputRange: [0, 1], outputRange: [1, 1] });
  const cardScale = transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} pointerEvents="none" />
        <View style={styles.backdropTint} pointerEvents="none" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} disabled={Boolean(isSubmitting)} />

        <Animated.View style={[styles.card, { height: cardHeight, transform: [{ scale: cardScale }] }]}>
          {showConfirmPanel ? (
            <Animated.View
              pointerEvents={mode === 'success' ? 'none' : 'auto'}
              style={[
                styles.panel,
                {
                  opacity: confirmOpacity,
                  transform: [{ scale: confirmScale }],
                },
              ]}
            >
              <View style={styles.confirmInner} onLayout={(e) => handleConfirmLayout(e.nativeEvent.layout.height)}>
                <View style={styles.header}>
                  <Text style={styles.title}>Confirm Book Class</Text>
                  <Text style={styles.subtitle} numberOfLines={2}>
                    Review details and confirm your booking
                  </Text>
                </View>

                <View style={styles.detailsCard}>
                  <DetailRow label="Class" value={eventName} />
                  <View style={styles.divider} />
                  <View style={styles.coachRow}>
                    <HexagonAvatar uri={coachAvatarUri} size={44} isIcon={!coachHasAvatar} />
                    <View style={styles.coachText}>
                      <Text style={styles.coachLabel}>Instructor</Text>
                      <Text style={styles.coachName} numberOfLines={1}>
                        {coachName || '—'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <DetailRow label="Date" value={eventDateLabel} />
                  <View style={styles.divider} />
                  <DetailRow label="Starts" value={startTimeLabel} />
                  <View style={styles.divider} />
                  <DetailRow label="Duration" value={durationText} />
                </View>

                <View style={styles.creditsCard}>
                  <Text style={styles.creditsTitle}>Credits</Text>
                  <Text style={styles.creditsText}>{creditsText}</Text>
                  {!!creditsErrorMessage && (
                    <Text style={styles.errorText}>{creditsErrorMessage}</Text>
                  )}
                </View>

                <SwipeToConfirm
                  key={`${visible ? 'open' : 'closed'}-${resetKey ?? 0}`}
                  onConfirm={() => {
                    setDidAttemptConfirm(true);
                    onConfirm();
                  }}
                  disabled={Boolean(isSubmitting) || insufficientCredits}
                  label={
                    insufficientCredits
                      ? 'Not enough credits'
                      : isSubmitting
                        ? 'Booking…'
                        : 'Swipe to book class'
                  }
                />

                <Pressable
                  onPress={onClose}
                  disabled={Boolean(isSubmitting)}
                  style={[styles.cancelButton, isSubmitting && styles.cancelButtonDisabled]}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </Animated.View>
          ) : null}

          <Animated.View
            pointerEvents={mode === 'success' ? 'auto' : 'none'}
            style={[
              styles.panel,
              styles.successPanel,
              {
                opacity: successOpacity,
                transform: [{ scale: successScale }],
              },
            ]}
          >
            <View
              style={styles.successInner}
              onLayout={(e) => handleSuccessLayout(e.nativeEvent.layout.height)}
            >
              <View style={styles.successContent}>
                <View style={styles.successIconWrap}>
                  <HexBadge size={88} />
                </View>

                <Text style={styles.successTitle}>SEE YOU IN CLASS!</Text>
                <Text style={styles.successSubtitle}>
                  You are booked in for <Text style={styles.successSubtitleStrong}>{eventName}</Text> at{' '}
                  <Text style={styles.successSubtitleStrong}>{startTimeLabel}</Text> on{' '}
                  <Text style={styles.successSubtitleStrong}>{eventDateLabel}</Text>
                </Text>
              </View>

              <View style={styles.successActions}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.successPrimaryButton}
                  onPress={() => {
                    if (onAddToCalendar) {
                      onAddToCalendar();
                    } else {
                      onClose();
                    }
                  }}
                >
                  <Text style={styles.successPrimaryText}>ADD TO CALENDAR</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} style={styles.successSecondaryButton} onPress={onClose}>
                  <Text style={styles.successSecondaryText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  backdropTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  panel: {
    ...StyleSheet.absoluteFillObject,
    padding: PANEL_PADDING,
  },
  successPanel: {
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 6,
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    lineHeight: 18,
  },
  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surface.elevated,
  },
  detailRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    color: '#E4E4E7',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.6,
  },
  coachRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coachText: {
    flex: 1,
    minWidth: 0,
  },
  coachLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  coachName: {
    marginTop: 4,
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.4,
  },
  creditsCard: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  creditsTitle: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  creditsText: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.4,
  },
  errorText: {
    marginTop: 10,
    color: '#FCA5A5',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    lineHeight: 16,
  },
  cancelButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelText: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  successInner: {
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  confirmInner: {
    alignSelf: 'stretch',
  },
  successContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  successIconWrap: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  successSubtitle: {
    marginTop: 10,
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  successSubtitleStrong: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.2,
  },
  successActions: {
    marginTop: 18,
    paddingBottom: 0,
  },
  successPrimaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successPrimaryText: {
    color: '#0A0A0A',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  successSecondaryButton: {
    marginTop: 10,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.strong,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSecondaryText: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});

function HexBadge({ size }: { size: number }) {
  const radius = size / 2;
  const points = Array.from({ length: 6 })
    .map((_, index) => {
      const angle = Math.PI / 6 + (index * Math.PI) / 3;
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon points={points} fill="#FFFFFF" />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="thumbs-up" size={size * 0.42} color="#0A0A0A" />
      </View>
    </View>
  );
}

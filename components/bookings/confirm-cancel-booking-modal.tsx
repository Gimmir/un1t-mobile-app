import { BlurView } from 'expo-blur';
import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { HexagonAvatar } from '@/components/classes';
import { SwipeToConfirm } from './swipe-to-confirm';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

type ConfirmCancelBookingModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
};

export function ConfirmCancelBookingModal({
  visible,
  onClose,
  onConfirm,
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
}: ConfirmCancelBookingModalProps) {
  const durationText = useMemo(() => {
    if (durationMinutes == null) return '—';
    return `${durationMinutes} min`;
  }, [durationMinutes]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} pointerEvents="none" />
        <View style={styles.backdropTint} pointerEvents="none" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} disabled={Boolean(isSubmitting)} />

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Cancel Booking</Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              Confirm you want to cancel this class
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

          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Notice</Text>
            <Text style={styles.noticeText}>This will cancel your booking.</Text>
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>

          <SwipeToConfirm
            key={`${visible ? 'open' : 'closed'}-${resetKey ?? 0}`}
            onConfirm={onConfirm}
            disabled={Boolean(isSubmitting)}
            label={isSubmitting ? 'Cancelling…' : 'Swipe to cancel booking'}
          />

          <Pressable
            onPress={onClose}
            disabled={Boolean(isSubmitting)}
            style={[styles.cancelButton, isSubmitting && styles.cancelButtonDisabled]}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Keep Booking</Text>
          </Pressable>
        </View>
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
    backgroundColor: '#0B0B0D',
    padding: 16,
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
  noticeCard: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  noticeTitle: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  noticeText: {
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
});

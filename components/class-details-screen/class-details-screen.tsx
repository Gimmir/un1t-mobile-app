import { ConfirmBookingModal, ConfirmCancelBookingModal } from '@/components/bookings';
import { useBookings, useCreateBooking, useUpdateBooking } from '@/src/features/bookings/hooks/use-bookings';
import { useEvent, usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import { useCurrentUser } from '@/src/features/users/hooks/use-users';
import { addToSystemCalendar } from '@/src/lib/calendar';
import { parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClassDetailsBottomCta } from './bottom-cta';
import { ClassDetailsDetailsSection } from './details-section';
import { ClassDetailsHeaderBlock } from './header-block';
import { ClassDetailsInstructorCard } from './instructor-card';
import { styles } from './styles';
import { ClassDetailsTopBar } from './top-bar';
import { useClassDetailsDerived } from './use-class-details-derived';
import { tryParseEvent } from './utils';

export function ClassDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; event?: string }>();
  const initialEvent = useMemo(() => tryParseEvent(params.event), [params.event]);
  const eventId = typeof params.id === 'string' ? params.id : null;
  const { data: eventData, isLoading, error } = useEvent(eventId, initialEvent ?? undefined);
  const event = eventData ?? initialEvent;

  const { populatedEvent } = usePopulatedEvent(event);
  const displayEvent = populatedEvent ?? event;

  const [isConfirmBookingOpen, setIsConfirmBookingOpen] = useState(false);
  const [confirmResetKey, setConfirmResetKey] = useState(0);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [cancelResetKey, setCancelResetKey] = useState(0);

  const {
    mutate: createBooking,
    isPending: isCreatingBooking,
    error: createBookingError,
  } = useCreateBooking();
  const {
    mutate: updateBooking,
    isPending: isCancellingBooking,
    error: cancelBookingError,
  } = useUpdateBooking();

  const { data: bookings = [] } = useBookings();
  const { data: currentUser } = useCurrentUser();

  const derived = useClassDetailsDerived({
    displayEvent,
    eventId,
    bookings: bookings as any[],
    currentUserId: currentUser?._id ?? null,
  });

  const ctaDisabled = derived.statusConfig.ctaDisabled || !event || isCreatingBooking || isCancellingBooking;
  const ctaText = derived.isBookedByMe ? 'CANCEL BOOKING' : derived.statusConfig.ctaText;
  const ctaBg = derived.isBookedByMe ? 'rgba(244, 63, 94, 0.14)' : derived.statusConfig.ctaBg;
  const ctaTextColor = derived.isBookedByMe ? '#F43F5E' : derived.statusConfig.ctaTextColor;
  const ctaBorderColor = derived.isBookedByMe ? 'rgba(244, 63, 94, 0.28)' : 'transparent';
  const bookingErrorMessage = (createBookingError as Error | null)?.message ?? null;
  const cancelErrorMessage = (cancelBookingError as Error | null)?.message ?? null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image source={require('@/assets/images/login-bg.png')} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)', '#000000']}
          locations={[0, 0.62, 1]}
          style={styles.heroOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          style={styles.topFade}
        />

        <ClassDetailsTopBar onBack={() => router.back()} />

        {isLoading && !event ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading class details…</Text>
          </View>
        ) : null}

        {!isLoading && !event && error ? (
          <View style={styles.loadingBlock}>
            <Text style={styles.errorTitle}>Couldn’t load class</Text>
            <Text style={styles.loadingText}>{(error as Error).message}</Text>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ClassDetailsHeaderBlock
            title={derived.title}
            timeRange={derived.timeRange}
            dateLabel={derived.dateLabel}
            isLoaded={Boolean(event)}
            missingIdLabel={params.id ? String(params.id).toUpperCase() : null}
            badgeText={derived.badgeText}
            badgeBg={derived.badgeBg}
            badgeTextColor={derived.badgeTextColor}
          />

          {event && (
            <ClassDetailsInstructorCard
              coachImageUri={derived.coachImageUri}
              coachHasAvatar={derived.coachHasAvatar}
              coachName={derived.coachName}
            />
          )}

          {event && (
            <ClassDetailsDetailsSection
              event={event}
              studioName={derived.studioName}
              dateLabel={derived.dateLabel}
              timeRange={derived.timeRange}
            />
          )}

          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionKicker}>CLASS DESCRIPTION</Text>
            <Text style={styles.descriptionText}>
              {event?.description ??
                'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.'}
            </Text>
          </View>
        </ScrollView>

        <ClassDetailsBottomCta
          paddingBottom={Math.max(14, insets.bottom + 14)}
          disabled={ctaDisabled}
          isCancel={derived.isBookedByMe}
          backgroundColor={ctaBg}
          borderColor={ctaBorderColor}
          textColor={ctaTextColor}
          label={event ? ctaText : 'BOOK CLASS'}
          onPress={() => {
            if (ctaDisabled) return;
            if (derived.isBookedByMe) {
              setCancelResetKey((v) => v + 1);
              setIsConfirmCancelOpen(true);
            } else {
              setConfirmResetKey((v) => v + 1);
              setIsConfirmBookingOpen(true);
            }
          }}
        />
      </SafeAreaView>

      <ConfirmBookingModal
        visible={isConfirmBookingOpen}
        onClose={() => {
          if (isCreatingBooking) return;
          setIsConfirmBookingOpen(false);
        }}
        onAddToCalendar={async () => {
          if (!displayEvent?.start_time) return;
          try {
            const startDate = parseISO(displayEvent.start_time);
            const endDate = displayEvent.end_time
              ? parseISO(displayEvent.end_time)
              : new Date(startDate.getTime() + Math.max(30, displayEvent.duration ?? 60) * 60 * 1000);

            const result = await addToSystemCalendar({
              title: derived.eventNameForModal,
              startDate,
              endDate,
              location: derived.studioName || undefined,
            });

            if (result.action === 'canceled') return;
            Alert.alert('Calendar', 'Event was sent to your calendar.');
            setIsConfirmBookingOpen(false);
          } catch (e) {
            Alert.alert('Couldn’t add to calendar', (e as Error)?.message ?? 'Please try again.');
          }
        }}
        onConfirm={() => {
          const idToBook = displayEvent?._id ?? eventId ?? '';
          if (!idToBook) {
            setConfirmResetKey((v) => v + 1);
            return;
          }

          createBooking(
            { event: idToBook },
            {
              onSuccess: () => {
                // Modal will transition into success state; user can close manually.
              },
              onError: () => {
                setConfirmResetKey((v) => v + 1);
              },
            }
          );
        }}
        isSubmitting={isCreatingBooking}
        errorMessage={bookingErrorMessage}
        resetKey={confirmResetKey}
        eventName={derived.eventNameForModal}
        coachName={derived.coachNameForModal}
        coachAvatarUri={derived.coachImageUri}
        coachHasAvatar={derived.coachHasAvatar}
        eventDateLabel={derived.modalDateLabel || '—'}
        startTimeLabel={derived.modalStartTimeLabel || '—'}
        durationMinutes={derived.modalDuration}
        creditCost={derived.modalCreditCost}
      />

      <ConfirmCancelBookingModal
        visible={isConfirmCancelOpen}
        onClose={() => {
          if (isCancellingBooking) return;
          setIsConfirmCancelOpen(false);
        }}
        onConfirm={() => {
          if (!derived.activeBookingId) {
            setCancelResetKey((v) => v + 1);
            return;
          }
          updateBooking(
            { bookingId: derived.activeBookingId, payload: { status: 'cancelled' } },
            {
              onSuccess: () => {
                setIsConfirmCancelOpen(false);
              },
              onError: () => {
                setCancelResetKey((v) => v + 1);
              },
            }
          );
        }}
        isSubmitting={isCancellingBooking}
        errorMessage={cancelErrorMessage}
        resetKey={cancelResetKey}
        eventName={derived.eventNameForModal}
        coachName={derived.coachNameForModal}
        coachAvatarUri={derived.coachImageUri}
        coachHasAvatar={derived.coachHasAvatar}
        eventDateLabel={derived.modalDateLabel || '—'}
        startTimeLabel={derived.modalStartTimeLabel || '—'}
        durationMinutes={derived.modalDuration}
      />
    </View>
  );
}

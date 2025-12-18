import type { Event } from '@/DATA_TYPES/event';
import { HexagonAvatar } from '@/components/classes';
import { useEvent, usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function tryParseEvent(raw: unknown): Event | null {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as Event;
  } catch {
    return null;
  }
}

export default function ClassDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; event?: string }>();
  const initialEvent = useMemo(() => tryParseEvent(params.event), [params.event]);
  const eventId = typeof params.id === 'string' ? params.id : null;
  const { data: eventData, isLoading, error } = useEvent(eventId, initialEvent ?? undefined);
  const event = eventData ?? initialEvent;
  
  // Fetch coach and studio data
  const { populatedEvent } = usePopulatedEvent(event);
  
  // Use populated event if available, otherwise fallback to original
  const displayEvent = populatedEvent ?? event;

  const title = (displayEvent?.name ?? 'CLASS').toUpperCase();
  const status = displayEvent?.status ?? 'active';
  const startTime = useMemo(() => {
    if (!event?.start_time) return '';
    try {
      return format(parseISO(event.start_time), 'HH:mm');
    } catch {
      return '';
    }
  }, [event?.start_time]);

  const endTime = useMemo(() => {
    if (!event?.end_time) return '';
    try {
      return format(parseISO(event.end_time), 'HH:mm');
    } catch {
      return '';
    }
  }, [event?.end_time]);

  const dateLabel = useMemo(() => {
    if (!event?.start_time) return '';
    try {
      return format(parseISO(event.start_time), 'd MMMM yyyy');
    } catch {
      return '';
    }
  }, [event?.start_time]);

  const timeRange = useMemo(() => {
    if (startTime && endTime) return `${startTime} — ${endTime}`;
    return startTime || endTime || '';
  }, [endTime, startTime]);

  const statusConfig = useMemo(() => {
    switch (status) {
      case 'cancelled':
        return {
          badgeText: 'CANCELLED',
          badgeBg: 'rgba(161, 161, 170, 0.12)',
          badgeTextColor: '#A1A1AA',
          ctaText: 'CLASS CANCELLED',
          ctaBg: '#27272A',
          ctaTextColor: '#A1A1AA',
          ctaDisabled: true,
        };
      case 'finished':
        return {
          badgeText: 'FINISHED',
          badgeBg: 'rgba(161, 161, 170, 0.12)',
          badgeTextColor: '#A1A1AA',
          ctaText: 'CLASS FINISHED',
          ctaBg: '#27272A',
          ctaTextColor: '#A1A1AA',
          ctaDisabled: true,
        };
      case 'full':
        return {
          badgeText: 'FULL',
          badgeBg: 'rgba(248, 113, 113, 0.18)',
          badgeTextColor: '#F87171',
          ctaText: 'CLASS FULL',
          ctaBg: '#27272A',
          ctaTextColor: '#A1A1AA',
          ctaDisabled: true,
        };
      case 'active':
      default:
        return {
          badgeText: 'Book Now',
          badgeBg: 'rgba(52, 211, 153, 0.15)',
          badgeTextColor: '#34D399',
          ctaText: 'BOOK CLASS',
          ctaBg: '#FFFFFF',
          ctaTextColor: '#000000',
          ctaDisabled: false,
        };
    }
  }, [status]);

  const coachName = useMemo(() => {
    if (!displayEvent?.instructor) return 'COACH';
    const firstName = displayEvent.instructor.firstName || '';
    const lastName = displayEvent.instructor.lastName || '';
    return `${firstName} ${lastName}`.trim().toUpperCase();
  }, [displayEvent]);

  const coachImageUri =
    displayEvent?.instructor?.avatar ?? `https://i.pravatar.cc/100?u=${displayEvent?.instructor?._id ?? 'coach'}`;

  const studioName = displayEvent?.location?.title?.trim() || '';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/login-bg.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
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

        <View style={styles.topBar}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>BOOK CLASS</Text>
          <View style={styles.topBarSpacer} />
        </View>

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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.classTitle}>{title}</Text>
            {!!event && (
              <Text style={styles.classMeta}>
                {!!timeRange && <Text style={styles.classMetaStrong}>{timeRange}</Text>}
                {!!timeRange && !!dateLabel && <Text style={styles.classMetaMuted}> • </Text>}
                {!!dateLabel && <Text style={styles.classMetaMuted}>{dateLabel}</Text>}
              </Text>
            )}
            {!!event && (
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.badgeBg }]}>
                <Text style={[styles.statusBadgeText, { color: statusConfig.badgeTextColor }]}>
                  {statusConfig.badgeText}
                </Text>
              </View>
            )}
            {!event && (
              <Text style={styles.missingMeta}>
                EVENT DETAILS NOT LOADED{params.id ? ` • ID ${String(params.id).toUpperCase()}` : ''}
              </Text>
            )}
          </View>

          {event && (
            <View style={styles.instructorCard}>
              <View style={styles.instructorRow}>
                <HexagonAvatar uri={coachImageUri} size={54} isIcon={!displayEvent?.instructor?.avatar} />
                <View style={styles.instructorText}>
                  <Text style={styles.sectionKicker}>INSTRUCTOR</Text>
                  <Text style={styles.instructorName}>{coachName || '—'}</Text>
                </View>
              </View>
            </View>
          )}

          {event && (
            <View style={styles.detailsBlock}>
              <Text style={styles.sectionKicker}>DETAILS</Text>
              <View style={styles.detailsCard}>
                <DetailRow label="STUDIO" value={studioName || '—'} />
                <View style={styles.detailsDivider} />
                <DetailRow label="DATE" value={dateLabel || '—'} />
                <View style={styles.detailsDivider} />
                <DetailRow label="TIME" value={timeRange || '—'} />
                <View style={styles.detailsDivider} />
                <DetailRow label="DURATION" value={`${event.duration} MIN`} />
                <View style={styles.detailsDivider} />
                <DetailRow
                  label="CREDITS"
                  value={`${event.credit_cost} ${event.credit_cost === 1 ? 'CREDIT' : 'CREDITS'}`}
                />
              </View>

              {!!event.tags?.length && (
                <View style={styles.tagsWrap}>
                  {event.tags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

            </View>
          )}

          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionKicker}>CLASS DESCRIPTION</Text>
            <Text style={styles.descriptionText}>
              {event?.description ??
                'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.'}
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.bottomCtaWrap, { paddingBottom: Math.max(14, insets.bottom + 14) }]}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)', '#000000']}
            locations={[0, 0.35, 1]}
            style={styles.bottomFade}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={statusConfig.ctaDisabled || !event}
            style={[
              styles.ctaButton,
              { backgroundColor: statusConfig.ctaBg },
              (statusConfig.ctaDisabled || !event) && styles.ctaButtonDisabled,
            ]}
          >
            <Text style={[styles.ctaText, { color: statusConfig.ctaTextColor }]}>
              {event ? statusConfig.ctaText : 'BOOK CLASS'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.92,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  safeArea: {
    flex: 1,
  },
  topFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 140,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  topBarSpacer: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingTop: 232,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  headerBlock: {
    paddingTop: 10,
  },
  classTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  classMeta: {
    marginTop: 12,
    color: '#E4E4E7',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  classMetaStrong: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  classMetaMuted: {
    color: '#D4D4D8',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  missingMeta: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  loadingBlock: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#71717A',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  instructorCard: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  instructorText: {
    flex: 1,
  },
  sectionKicker: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  instructorName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descriptionBlock: {
    marginTop: 22,
  },
  descriptionText: {
    marginTop: 14,
    color: '#B6B6BE',
    fontSize: 16,
    lineHeight: 27,
  },
  detailsBlock: {
    marginTop: 22,
  },
  detailsCard: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  detailsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1F1F23',
  },
  detailRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tagsWrap: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tagChipText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bottomCtaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -34,
  },
  ctaButton: {
    height: 56,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaButtonDisabled: {
    opacity: 0.92,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

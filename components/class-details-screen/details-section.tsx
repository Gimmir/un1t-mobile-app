import type { Event } from '@/DATA_TYPES/event';
import React from 'react';
import { Text, View } from 'react-native';
import { DetailRow } from './detail-row';
import { styles } from './styles';

export function ClassDetailsDetailsSection({
  event,
  studioName,
  dateLabel,
  timeRange,
}: {
  event: Event;
  studioName: string;
  dateLabel: string;
  timeRange: string;
}) {
  const creditCost = 1;

  return (
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
          value={`${creditCost} ${creditCost === 1 ? 'CREDIT' : 'CREDITS'}`}
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
  );
}

import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export function ClassDetailsHeaderBlock({
  title,
  timeRange,
  dateLabel,
  isLoaded,
  missingIdLabel,
  badgeText,
  badgeBg,
  badgeTextColor,
}: {
  title: string;
  timeRange: string;
  dateLabel: string;
  isLoaded: boolean;
  missingIdLabel: string | null;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
}) {
  return (
    <View style={styles.headerBlock}>
      <Text style={styles.classTitle}>{title}</Text>

      {isLoaded ? (
        <>
          <Text style={styles.classMeta}>
            {!!timeRange && <Text style={styles.classMetaStrong}>{timeRange}</Text>}
            {!!timeRange && !!dateLabel && <Text style={styles.classMetaMuted}> • </Text>}
            {!!dateLabel && <Text style={styles.classMetaMuted}>{dateLabel}</Text>}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.statusBadgeText, { color: badgeTextColor }]}>{badgeText}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.missingMeta}>
          EVENT DETAILS NOT LOADED{missingIdLabel ? ` • ID ${missingIdLabel}` : ''}
        </Text>
      )}
    </View>
  );
}


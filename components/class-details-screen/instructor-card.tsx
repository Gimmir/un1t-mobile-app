import { HexagonAvatar } from '@/components/classes';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export function ClassDetailsInstructorCard({
  coachImageUri,
  coachHasAvatar,
  coachName,
}: {
  coachImageUri: string;
  coachHasAvatar: boolean;
  coachName: string;
}) {
  return (
    <View style={styles.instructorCard}>
      <View style={styles.instructorRow}>
        <HexagonAvatar uri={coachImageUri} size={54} isIcon={!coachHasAvatar} />
        <View style={styles.instructorText}>
          <Text style={styles.sectionKicker}>INSTRUCTOR</Text>
          <Text style={styles.instructorName}>{coachName || '—'}</Text>
        </View>
      </View>
    </View>
  );
}


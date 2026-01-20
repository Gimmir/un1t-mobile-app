import {
  normalizeUnit,
  resolveBodyCompositionMetric,
  resolveBodyCompositionTitle,
} from '@/components/body-composition-details-screen/body-composition-utils';
import {
  buildBodyCompositionInfoContent,
  buildTargetRangeSubtitle,
  clampToMinDate,
  formatTargetDate,
  getStartOfToday,
  parseTargetDate,
} from '@/components/body-composition-details-screen/body-composition-update-results.utils';
import { BodyCompositionInfoModal } from '@/components/body-composition-details-screen';
import { DobPickerModal } from '@/components/profile/account-details/DobPickerModal';
import {
  UpdateResultsDateCard,
  UpdateResultsLayout,
  UpdateResultsPrimaryButton,
  UpdateResultsSectionLabel,
  UpdateResultsTextInput,
} from '@/components/update-results';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';

export default function BodyCompositionUpdateResultsScreen() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { id, label } = useLocalSearchParams<{ id?: string; label?: string }>();

  const metric = useMemo(() => resolveBodyCompositionMetric(id, label), [id, label]);
  const resolvedTitle = useMemo(
    () => resolveBodyCompositionTitle(metric, typeof label === 'string' ? label : undefined),
    [metric, label]
  );
  const helpTitle = metric?.helpTitle ?? `What is ${resolvedTitle}`;
  const unitLabel = normalizeUnit(metric?.current.unit);
  const targetUnit = normalizeUnit(metric?.target.unit) || unitLabel;
  const minimumDate = useMemo(getStartOfToday, []);

  const [latestMeasure, setLatestMeasure] = useState('');
  const [targetValue, setTargetValue] = useState(metric?.target.value ?? '');
  const [targetDate, setTargetDate] = useState<Date>(() =>
    clampToMinDate(parseTargetDate(metric?.targetDate), minimumDate)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const targetLabel = unitLabel ? `TARGET ${unitLabel}` : 'TARGET';
  const formattedTargetDate = useMemo(() => formatTargetDate(targetDate), [targetDate]);
  const targetRangeSubtitle = useMemo(() => buildTargetRangeSubtitle(user), [user]);
  const infoContent = useMemo(
    () => buildBodyCompositionInfoContent(metric, resolvedTitle, targetRangeSubtitle),
    [metric, resolvedTitle, targetRangeSubtitle]
  );

  const handleDatePress = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTargetDate(clampToMinDate(selectedDate, minimumDate));
    }
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }}
      />
      <StatusBar style="light" />
      <UpdateResultsLayout
        headerTitle="ENTER YOUR RESULTS"
        onClose={() => router.back()}
        helpText={helpTitle}
        onHelpPress={() => setShowInfoModal(true)}
      >
        <UpdateResultsSectionLabel style={styles.sectionLabel}>LATEST MEASURE</UpdateResultsSectionLabel>
        <UpdateResultsTextInput
          value={latestMeasure}
          onChangeText={setLatestMeasure}
          placeholder="Enter measure"
          onSubmitEditing={Keyboard.dismiss}
          unit={unitLabel}
          containerStyle={styles.inputSpacing}
        />

        <UpdateResultsSectionLabel style={styles.sectionLabel}>{targetLabel}</UpdateResultsSectionLabel>
        <UpdateResultsTextInput
          value={targetValue}
          onChangeText={setTargetValue}
          placeholder="0"
          onSubmitEditing={Keyboard.dismiss}
          unit={targetUnit}
          containerStyle={styles.inputSpacing}
        />
        <Text style={styles.helperText}>
          Always check your target is a healthy range for your age
        </Text>

        <UpdateResultsSectionLabel style={styles.sectionLabel}>TARGET DATE</UpdateResultsSectionLabel>
        <UpdateResultsDateCard value={formattedTargetDate} onPress={handleDatePress} />

        <UpdateResultsPrimaryButton label="SAVE" onPress={Keyboard.dismiss} />
      </UpdateResultsLayout>
      <DobPickerModal
        visible={showDatePicker}
        value={targetDate}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
        title="TARGET DATE"
        showTopBorder={false}
        minimumDate={minimumDate}
      />
      <BodyCompositionInfoModal
        visible={showInfoModal}
        title={infoContent.title}
        description={infoContent.description}
        targetRangeTitle={infoContent.targetRangeTitle}
        targetRangeSubtitle={infoContent.targetRangeSubtitle}
        ranges={infoContent.ranges}
        onClose={() => setShowInfoModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  sectionLabel: {
    marginBottom: 10,
  },
  inputSpacing: {
    marginBottom: 18,
  },
  helperText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    lineHeight: 16,
    marginTop: -6,
    marginBottom: 18,
  },
});

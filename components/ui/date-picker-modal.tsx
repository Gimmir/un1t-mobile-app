import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type DatePickerModalProps = {
  visible: boolean;
  value: Date;
  maximumDate?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  title?: string;
};

export function DatePickerModal({
  visible,
  value,
  maximumDate,
  onChange,
  onClose,
  title = 'DATE OF BIRTH',
}: DatePickerModalProps) {
  if (!visible) return null;

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed' || !selectedDate) {
      if (Platform.OS === 'android') {
        onClose();
      }
      return;
    }

    onChange(selectedDate);

    if (Platform.OS === 'android') {
      onClose();
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={handleChange}
        maximumDate={maximumDate}
      />
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <BlurView intensity={80} tint="dark" style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            onChange={handleChange}
            maximumDate={maximumDate}
            themeVariant="dark"
            textColor="#FFFFFF"
          />
        </BlurView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingBottom: 30,
    paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    color: '#9CA3AF',
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});


import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function DobPickerModal(props: {
  visible: boolean;
  value: Date;
  maximumDate: Date;
  onChange: (_event: unknown, date?: Date) => void;
  onClose: () => void;
}) {
  const { visible, value, maximumDate, onChange, onClose } = props;

  if (!visible) return null;

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker value={value} mode="date" display="default" onChange={onChange} maximumDate={maximumDate} />
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>DATE OF BIRTH</Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.done}
            >
              <Text style={styles.doneText}>DONE</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              onChange={onChange}
              maximumDate={maximumDate}
              themeVariant="dark"
              textColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  done: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  pickerWrap: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
});


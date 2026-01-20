import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

export function DobPickerModal(props: {
  visible: boolean;
  value: Date;
  maximumDate?: Date;
  minimumDate?: Date;
  title?: string;
  showTopBorder?: boolean;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onClose: () => void;
}) {
  const { visible, value, maximumDate, minimumDate, title, showTopBorder = true, onChange, onClose } = props;
  const resolvedTitle = (title ?? 'DATE OF BIRTH').toUpperCase();
  const topBorderClassName = showTopBorder ? 'border-t border-white/20' : '';

  if (!visible) return null;

  if (Platform.OS === 'ios') {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <BlurView intensity={20} tint="dark" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />

          <BlurView
            intensity={80}
            tint="dark"
            className={`overflow-hidden rounded-t-3xl ${topBorderClassName}`}
          >
            <View className="bg-black/40 pb-10 pt-2">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-white/10">
                <Text className="text-zinc-400 text-sm tracking-wider font-bold">{resolvedTitle}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-white/10 px-4 py-1.5 rounded-full"
                >
                  <Text className="text-white font-bold text-sm">Done</Text>
                </TouchableOpacity>
              </View>

              <View className="items-center justify-center pt-2">
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                  maximumDate={maximumDate}
                  minimumDate={minimumDate}
                  themeVariant="dark"
                  textColor="white"
                />
              </View>
            </View>
          </BlurView>
        </BlurView>
      </Modal>
    );
  }

  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
}

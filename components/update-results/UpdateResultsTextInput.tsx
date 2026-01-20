import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  View,
} from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type UpdateResultsTextInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  unit?: string;
  keyboardType?: KeyboardTypeOptions;
  onSubmitEditing?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function UpdateResultsTextInput({
  value,
  onChangeText,
  placeholder,
  unit,
  keyboardType = 'numeric',
  onSubmitEditing,
  containerStyle,
  inputStyle,
}: UpdateResultsTextInputProps) {
  return (
    <View style={[styles.inputCard, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        keyboardType={keyboardType}
        keyboardAppearance="dark"
        onSubmitEditing={onSubmitEditing}
        style={[styles.inputText, inputStyle]}
      />
      {unit ? <Text style={styles.inputUnit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    paddingHorizontal: 16,
    height: 52,
  },
  inputText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
  },
  inputUnit: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
});

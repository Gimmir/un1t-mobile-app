import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

type Props = Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'> & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export const PasswordInputCard = React.forwardRef<TextInput, Props>(function PasswordInputCard(
  {
    value,
    onChangeText,
    placeholder,
    autoCapitalize = 'none',
    autoCorrect = false,
    ...textInputProps
  },
  ref
) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.inputCard}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={ colors.text.muted }
        secureTextEntry={!isVisible}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={styles.input}
        {...textInputProps}
      />
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={() => setIsVisible((prev) => !prev)}
        style={styles.eyeButton}
        hitSlop={8}
      >
        <Ionicons name={isVisible ? 'eye-off' : 'eye'} size={20} color={ colors.text.secondary } />
      </TouchableOpacity>
    </View>
  );
});

PasswordInputCard.displayName = 'PasswordInputCard';

const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
    paddingVertical: 4,
  },
  eyeButton: {
    paddingLeft: 12,
    paddingVertical: 6,
  },
});
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface CustomInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  placeholder: string;
  type?: 'text' | 'email' | 'password' | 'phone';
  showClearButton?: boolean;
  helperText?: string;
  variant?: 'card' | 'pill';
  leadingIconName?: string;
  leadingIconColor?: string;
}

export function CustomInput<T extends FieldValues>({
  control,
  name,
  error,
  placeholder,
  type = 'text',
  showClearButton = false,
  helperText,
  variant = 'card',
  leadingIconName,
  leadingIconColor = colors.text.secondary,
  ...textInputProps
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const { onBlur: onBlurProp, onFocus: onFocusProp, ...restTextInputProps } = textInputProps;

  const getBorderStyle = (hasError: boolean, value: string) => {
    if (hasError) return 'border border-red-500';
    if (isFocused) return 'border border-white/35';
    if (variant === 'pill') return 'border border-white/12';
    if (value && value.length > 0) return 'border border-white/20';
    return 'border border-[#1C1C1F]';
  };

  const getTextColor = (hasError: boolean) => (hasError ? 'text-red-500' : 'text-white');

  const getKeyboardType = () => {
    if (type === 'email') return 'email-address';
    if (type === 'phone') return 'phone-pad';
    return 'default';
  };

  const getAutoComplete = (): TextInputProps['autoComplete'] => {
    if (type === 'email') return 'email';
    if (type === 'password') return 'password-new';
    if (type === 'phone') return 'tel';
    return 'off';
  };

  const getTextContentType = (): TextInputProps['textContentType'] => {
    if (type === 'email') return 'emailAddress';
    if (type === 'password') return 'newPassword';
    if (type === 'phone') return 'telephoneNumber';
    return 'none';
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <View
            className={`bg-[#111113] flex-row items-center ${
              variant === 'pill' ? 'h-[56px] rounded-full px-5' : 'h-[52px] rounded-[10px] px-4'
            } ${getBorderStyle(!!error, value)}`}
          >
            {leadingIconName ? (
              <View className="mr-3">
                <IconSymbol name={leadingIconName as any} size={20} color={leadingIconColor} />
              </View>
            ) : null}

            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur();
                onBlurProp?.(e);
              }}
              onFocus={(e) => {
                setIsFocused(true);
                onFocusProp?.(e);
              }}
              placeholder={placeholder}
              placeholderTextColor={ colors.text.muted }
              className={`flex-1 ${getTextColor(!!error)}`}
              style={{ fontSize: typography.size.lg }}
              secureTextEntry={isPassword && !showPassword}
              keyboardType={getKeyboardType()}
              autoComplete={getAutoComplete()}
              textContentType={getTextContentType()}
              autoCapitalize={type === 'email' ? 'none' : textInputProps.autoCapitalize || 'sentences'}
              autoCorrect={type === 'email' ? false : textInputProps.autoCorrect}
              {...restTextInputProps}
            />
            
            {isPassword && (
              <TouchableOpacity accessibilityRole="button" onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? 'eye.slash' : 'eye'} size={20} color={ colors.text.secondary } />
              </TouchableOpacity>
            )}
            
            {showClearButton && value && value.length > 0 && !isPassword && (
              <TouchableOpacity accessibilityRole="button" onPress={() => onChange('')}>
                <IconSymbol name="xmark" size={18} color={ colors.text.secondary } />
              </TouchableOpacity>
            )}
          </View>
          
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
          )}
          
          {helperText && !error && (
            <Text className="text-zinc-500 text-xs leading-4 mt-1 px-1">{helperText}</Text>
          )}
        </View>
      )}
    />
  );
}

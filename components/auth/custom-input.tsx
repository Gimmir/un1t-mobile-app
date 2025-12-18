import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
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
}

export function CustomInput<T extends FieldValues>({
  control,
  name,
  error,
  placeholder,
  type = 'text',
  showClearButton = false,
  helperText,
  ...textInputProps
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const getBorderStyle = (hasError: boolean, value: string) => {
    if (hasError) return 'border-b border-red-500';
    if (value && value.length > 0) return 'border-b border-white';
    return 'border-b border-transparent';
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
          <View className={`bg-[#252525] px-4 flex-row items-center h-[52px] ${getBorderStyle(!!error, value)}`}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#52525b"
              className={`flex-1 ${getTextColor(!!error)}`}
              style={{ fontSize: 16 }}
              secureTextEntry={isPassword && !showPassword}
              keyboardType={getKeyboardType()}
              autoComplete={getAutoComplete()}
              textContentType={getTextContentType()}
              autoCapitalize={type === 'email' ? 'none' : textInputProps.autoCapitalize || 'sentences'}
              autoCorrect={type === 'email' ? false : textInputProps.autoCorrect}
              {...textInputProps}
            />
            
            {isPassword && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? 'eye.slash' : 'eye'} size={20} color="#52525b" />
              </TouchableOpacity>
            )}
            
            {showClearButton && value && value.length > 0 && !isPassword && (
              <TouchableOpacity onPress={() => onChange('')}>
                <IconSymbol name="xmark" size={18} color="#52525b" />
              </TouchableOpacity>
            )}
          </View>
          
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
          )}
          
          {helperText && !error && (
            <Text className="text-zinc-500 text-[11px] leading-4 mt-1 px-1">{helperText}</Text>
          )}
        </View>
      )}
    />
  );
}

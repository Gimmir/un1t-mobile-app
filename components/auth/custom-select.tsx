import { IconSymbol } from '@/components/ui/icon-symbol';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  placeholder: string;
  onPress: () => void;
  formatValue?: (value: string) => string;
}

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  error,
  placeholder,
  onPress,
  formatValue,
}: CustomSelectProps<T>) {
  const getBorderStyle = (hasError: boolean, value: string) => {
    if (hasError) return 'border border-red-500';
    if (value && value.length > 0) return 'border border-white/20';
    return 'border border-[#1C1C1F]';
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value } }) => (
        <View>
          <TouchableOpacity
            onPress={onPress}
            className={`bg-[#111113] px-4 flex-row items-center h-[52px] rounded-[10px] justify-between active:opacity-80 ${getBorderStyle(
              !!error,
              value
            )}`}
          >
            <Text
              className={value ? 'text-white' : 'text-[#71717A]'}
              style={{ fontSize: 16 }}
            >
              {value ? (formatValue ? formatValue(value) : value) : placeholder}
            </Text>
            <IconSymbol name="chevron.down" size={16} color="#71717A" />
          </TouchableOpacity>
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

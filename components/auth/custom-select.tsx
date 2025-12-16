import { IconSymbol } from '@/components/ui/icon-symbol';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  placeholder: string;
  onPress: () => void;
}

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  error,
  placeholder,
  onPress,
}: CustomSelectProps<T>) {
  const getBorderStyle = (hasError: boolean, value: string) => {
    if (hasError) return 'border-b border-red-500';
    if (value) return 'border-b border-white';
    return 'border-b border-transparent';
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value } }) => (
        <View>
          <TouchableOpacity
            onPress={onPress}
            className={`bg-[#252525] px-4 flex-row items-center h-[52px] justify-between active:opacity-80 ${getBorderStyle(!!error, value)}`}
          >
            <Text
              className={value ? 'text-white' : 'text-[#52525b]'}
              style={{ fontSize: 16 }}
            >
              {value || placeholder}
            </Text>
            <IconSymbol name="chevron.down" size={16} color="#52525b" />
          </TouchableOpacity>
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ReactNode } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

interface CustomCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  label: string | ReactNode;
}

export function CustomCheckbox<T extends FieldValues>({
  control,
  name,
  error,
  label,
}: CustomCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="flex-row gap-3 items-start">
          <TouchableOpacity
            onPress={() => onChange(!value)}
            className={`w-6 h-6 rounded border items-center justify-center ${
              value ? 'bg-white border-white' : 'bg-transparent border-zinc-700'
            }`}
          >
            {value && <IconSymbol name="checkmark" size={14} color="black" weight="bold" />}
          </TouchableOpacity>

          <View className="flex-1">
            {typeof label === 'string' ? (
              <Text className="text-white" style={{ fontSize: 16, lineHeight: 24 }}>
                {label}
              </Text>
            ) : (
              label
            )}
            {error && <Text className="text-red-500 text-xs mt-1">{error.message}</Text>}
          </View>
        </View>
      )}
    />
  );
}

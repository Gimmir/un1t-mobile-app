import { CustomCheckbox, PrimaryButton } from '@/components/auth';
import React from 'react';
import type { Control, FieldError, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';

type WaiverFieldValues = {
  waiverAgreed: boolean;
};

export function WaiverFooter<T extends FieldValues & WaiverFieldValues>(props: {
  control: Control<T>;
  error?: FieldError;
  isPending: boolean;
  onSubmit: () => void;
}) {
  const { control, error, isPending, onSubmit } = props;

  return (
    <View className="mb-8">
      <CustomCheckbox control={control} name={'waiverAgreed' as Path<T>} error={error} label="I agree" />

      <View className="mt-6">
        <PrimaryButton
          title={isPending ? 'REGISTERING…' : 'REGISTER'}
          onPress={onSubmit}
          disabled={isPending}
        />
      </View>
    </View>
  );
}

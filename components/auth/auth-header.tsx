import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { ProgressDots } from './progress-dots';

interface AuthHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export function AuthHeader({ currentStep, totalSteps, onBack }: AuthHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-2 pb-6">
      <TouchableOpacity 
        onPress={handleBack} 
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="xmark" size={24} color="white" />
      </TouchableOpacity>

      <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />

      <View className="w-6" />
    </View>
  );
}

import { PrimaryButton } from '@/components/auth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

export default function CheckEmailScreen() {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.surface.app }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6 items-center pb-20">
          <Text className="text-white text-2xl font-bold mb-10 text-center tracking-wider uppercase">
            CHECK YOUR EMAIL
          </Text>

          <View className="items-center justify-center mb-10">
            <MaterialCommunityIcons name="hexagon" size={140} color="white" />
            <View className="absolute">
              <Ionicons name="mail" size={60} color={ colors.surface.app } />
            </View>
          </View>

          <Text
            className="text-center mb-10 px-2 leading-6 text-base"
            style={{ color: colors.text.secondary }}
          >
            If there is an account associated with your email we will have sent you a link to re-set your password
          </Text>

          <View className="w-full">
            <PrimaryButton title="GO TO LOGIN" onPress={handleGoToLogin} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

import { PrimaryButton } from '@/components/auth';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ImageBackground
        source={require('@/assets/images/login-bg.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/30">
          <SafeAreaView className="flex-1">
            <View className="flex-1 justify-center items-center">
              <Image
                source={require('@/assets/images/logo.png')}
                className="w-64 h-32"
                resizeMode="contain"
              />
            </View>

            <View className="px-6 pb-12 gap-4 flex-row">
              <View className="flex-1">
                <PrimaryButton
                  title="SIGN UP"
                  onPress={() => router.push('/(auth)/sign-up')}
                />
              </View>

              <View className="flex-1">
                <PrimaryButton
                  title="LOGIN"
                  variant="secondary"
                  onPress={() => {
                    console.log('Login pressed');
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

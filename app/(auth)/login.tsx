import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-slate-900 mb-2">З поверненням!</Text>
      <Text className="text-slate-500 text-lg mb-8">Введіть свої дані для входу</Text>
      
      {/* Місце для форми логіну */}
      <View className="h-48 bg-slate-50 rounded-2xl border border-slate-100 mb-8 items-center justify-center">
        <Text className="text-slate-400">Тут буде форма входу</Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.replace('/(tabs)')} // Тимчасовий перехід
        className="w-full bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200"
      >
        <Text className="text-white font-bold text-lg">Увійти</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} className="mt-6 items-center">
        <Text className="text-slate-500">Назад на головну</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-4">
      <Text className="text-2xl font-bold text-slate-900 mb-6">Створення акаунту</Text>
      
      {/* Місце для форми реєстрації */}
      <View className="flex-1">
         <Text className="text-slate-500">Поля: Ім'я, Email, Пароль...</Text>
      </View>

      <TouchableOpacity 
        className="w-full bg-slate-900 py-4 rounded-2xl items-center mb-8"
      >
        <Text className="text-white font-bold text-lg">Продовжити</Text>
      </TouchableOpacity>
    </View>
  );
}
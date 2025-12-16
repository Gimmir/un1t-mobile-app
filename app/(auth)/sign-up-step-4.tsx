import { IconSymbol } from '@/components/ui/icon-symbol';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

// --- ВАЛІДАЦІЯ ---
const step4Schema = z.object({
  waiverAgreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the waiver" }) }),
});

type Step4FormData = z.infer<typeof step4Schema>;

export default function SignUpStep4Screen() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      waiverAgreed: undefined,
    }
  });

  const onSubmit = (data: Step4FormData) => {
    console.log("FINAL STEP DATA:", data);
    console.log("--- REGISTRATION COMPLETE ---");
    
    // Тут логіка завершення реєстрації (API запит)
    
    Alert.alert(
      "Welcome to UN1T!", 
      "Your account has been successfully created.",
      [
        { text: "Let's Go", onPress: () => router.replace('/(tabs)/home') } // Або перехід на логін
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#191919]">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-2 pb-6">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <IconSymbol name="xmark" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row gap-1.5 items-center absolute left-0 right-0 justify-center pointer-events-none">
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" />
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" /> 
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" />     
            <View className="w-8 h-1 bg-white rounded-full" />
          </View>
          
          <View className="w-6" />
        </View>

        <View className="flex-1 px-6">
          <Text className="text-white text-2xl font-bold mt-2 mb-6 text-center tracking-wider uppercase">
            SIGN WAIVER
          </Text>

          <View className="flex-1 mb-6">
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
            >
                <Text className="text-zinc-400 text-sm leading-6 mb-4">
                    Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:
                </Text>
                <Text className="text-zinc-400 text-sm leading-6 mb-4 italic">
                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
                </Text>
                <Text className="text-zinc-400 text-sm leading-6 mb-4">
                    The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
                </Text>
                <Text className="text-zinc-400 text-sm leading-6 mb-4">
                   Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.
                </Text>
                <Text className="text-zinc-400 text-sm leading-6 mb-10">
                   By checking the box below, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </Text>
            </ScrollView>
            
            <View className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#191919] to-transparent" pointerEvents="none" />
          </View>

          <View className="mb-8">
            <Controller
                control={control}
                name="waiverAgreed"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <TouchableOpacity 
                            activeOpacity={1}
                            onPress={() => onChange(!value)}
                            className="flex-row items-center gap-4 mb-2"
                        >
                            <View 
                                className={`w-6 h-6 rounded border items-center justify-center ${
                                    value 
                                    ? 'bg-white border-white' 
                                    : 'bg-transparent border-zinc-500'
                                }`}
                            >
                                {value && <IconSymbol name="checkmark" size={14} color="black" weight="bold" />}
                            </View>
                            <Text className="text-white text-base font-medium">I agree</Text>
                        </TouchableOpacity>
                        {errors.waiverAgreed && (
                             <Text className="text-red-500 text-xs ml-10">{errors.waiverAgreed.message}</Text>
                        )}
                    </View>
                )}
            />

            <TouchableOpacity 
                className="bg-white h-[52px] justify-center items-center mt-6 active:opacity-90"
                onPress={handleSubmit(onSubmit)}
            >
                <Text className="text-black font-bold text-base tracking-widest">REGISTER</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}
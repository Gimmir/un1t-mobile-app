import { IconSymbol } from '@/components/ui/icon-symbol';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

// --- ЛОГІКА ОБМЕЖЕННЯ ДАТИ (12+) ---
const today = new Date();
// Віднімаємо рівно 12 років від сьогоднішнього дня
const maxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

// --- ВАЛІДАЦІЯ ---
const step2Schema = z.object({
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postcode: z.string().min(3, { message: "Postcode is required" }),
  dob: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(['Male', 'Female', 'Prefer not to say'], { required_error: "Please select gender" }),
  measurement: z.enum(['Imperial', 'Metric'], { required_error: "Please select units" }),
});

type Step2FormData = z.infer<typeof step2Schema>;

export default function SignUpStep2Screen() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
      address: '',
      city: '',
      postcode: '',
      // @ts-ignore
      dob: undefined, 
      gender: 'Male',
      measurement: 'Metric',
    }
  });

  const onSubmit = (data: Step2FormData) => {
    console.log("Step 2 Data:", data);
    router.push('/(auth)/sign-up-step-3');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    // Якщо користувач скасував вибір (на Android), selectedDate буде undefined
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getBorderStyle = (error: any, value: any) => {
    if (error) return 'border-b border-red-500';
    if (value) return 'border-b border-white';
    return 'border-b border-transparent';
  };

  const getTextColor = (error: any) => (error ? 'text-red-500' : 'text-white');
  const baseInputStyle = "bg-[#252525] px-4 flex-row items-center h-[52px]";

  const getMeasurementLabel = (type: string) => {
    if (type === 'Metric') return 'Metric (kg)';
    if (type === 'Imperial') return 'Imperial (lbs)';
    return type;
  };

  const dobValue = watch('dob');

  return (
    <View className="flex-1 bg-[#191919]">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 py-2 pb-6">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <IconSymbol name="xmark" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row gap-1.5 items-center absolute left-0 right-0 justify-center pointer-events-none">
            <View className="w-1.5 h-1 bg-white rounded-full opacity-50" />
            <View className="w-8 h-1 bg-white rounded-full" /> 
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" />
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" />
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" />
          </View>
          
          <View className="w-6" />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-5">
              <Text className="text-white text-2xl font-bold mt-2 mb-8 text-center tracking-wider">
                CREATE YOUR ACCOUNT
              </Text>

              <View className="gap-3">
                {/* 1. Phone Number */}
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.phoneNumber, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Phone Number"
                          placeholderTextColor="#52525b"
                          keyboardType="phone-pad"
                          textContentType="telephoneNumber" 
                          autoComplete="tel"
                          className={`flex-1 ${getTextColor(errors.phoneNumber)}`}
                          style={{ fontSize: 16 }}
                        />
                      </View>
                      {errors.phoneNumber && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber.message}</Text>}
                    </View>
                  )}
                />

                {/* 2. Address */}
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.address, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Address Line"
                          placeholderTextColor="#52525b"
                          textContentType="streetAddressLine1"
                          autoComplete="address-line1"
                          autoCapitalize="words"
                          className={`flex-1 ${getTextColor(errors.address)}`}
                          style={{ fontSize: 16 }}
                        />
                      </View>
                      {errors.address && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</Text>}
                    </View>
                  )}
                />

                {/* 3. City */}
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.city, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="City"
                          placeholderTextColor="#52525b"
                          textContentType="addressCity"
                          autoComplete="postal-address-locality"
                          autoCapitalize="words"
                          className={`flex-1 ${getTextColor(errors.city)}`}
                          style={{ fontSize: 16 }}
                        />
                      </View>
                      {errors.city && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.city.message}</Text>}
                    </View>
                  )}
                />

                {/* 4. Postcode */}
                <Controller
                  control={control}
                  name="postcode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.postcode, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Postcode"
                          placeholderTextColor="#52525b"
                          textContentType="postalCode"
                          autoComplete="postal-code"
                          autoCapitalize="characters"
                          className={`flex-1 ${getTextColor(errors.postcode)}`}
                          style={{ fontSize: 16 }}
                        />
                      </View>
                      {errors.postcode && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.postcode.message}</Text>}
                    </View>
                  )}
                />

                {/* 5. DOB */}
                <Controller
                  control={control}
                  name="dob"
                  render={({ field: { value } }) => (
                    <View>
                      <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        className={`${baseInputStyle} active:opacity-80 justify-between ${getBorderStyle(errors.dob, value)}`}
                      >
                         <Text className={value ? "text-white" : "text-[#52525b]"} style={{ fontSize: 16 }}>
                            {value ? formatDate(value) : "DOB (DD/MM/YYYY)"}
                         </Text>
                      </TouchableOpacity>
                      {errors.dob && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.dob.message}</Text>}
                    </View>
                  )}
                />

                {/* Gender */}
                <View className="mt-4">
                    <Text className="text-zinc-500 text-center text-xs tracking-widest mb-3 font-bold uppercase">Select Your Gender</Text>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row flex-wrap gap-3">
                                {['Male', 'Female', 'Prefer not to say'].map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => onChange(option)}
                                        className={`flex-grow basis-[40%] h-[50px] items-center justify-center border ${
                                            value === option 
                                            ? 'border-white bg-[#252525]' 
                                            : 'border-zinc-700 bg-transparent'
                                        }`}
                                    >
                                        <Text className={`text-base font-medium ${value === option ? 'text-white' : 'text-zinc-500'}`}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>

                {/* Measurements */}
                <View className="mt-4">
                    <Text className="text-zinc-500 text-center text-xs tracking-widest mb-3 font-bold uppercase">I Would Like To See Measurements In...</Text>
                    <Controller
                        control={control}
                        name="measurement"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row gap-4">
                                {['Imperial', 'Metric'].map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => onChange(option)}
                                        className={`flex-1 h-[50px] items-center justify-center border ${
                                            value === option ? 'border-white bg-[#252525]' : 'border-zinc-700 bg-transparent'
                                        }`}
                                    >
                                        <Text className={`text-base font-medium ${value === option ? 'text-white' : 'text-zinc-500'}`}>
                                            {getMeasurementLabel(option)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>

                {/* NEXT Button */}
                <TouchableOpacity 
                    className="bg-white h-[52px] justify-center items-center mt-10 mb-10 active:opacity-90"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-black font-bold text-base tracking-widest">NEXT</Text>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Date Picker (Liquid Glass) */}
        {showDatePicker && (
          Platform.OS === 'ios' ? (
             <Modal
               transparent={true}
               animationType="fade"
               visible={showDatePicker}
               onRequestClose={() => setShowDatePicker(false)}
             >
               <BlurView intensity={20} tint="dark" style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <TouchableOpacity 
                      style={{ flex: 1 }} 
                      activeOpacity={1} 
                      onPress={() => setShowDatePicker(false)} 
                  />
                  
                  <BlurView 
                    intensity={80} 
                    tint="dark" 
                    className="overflow-hidden rounded-t-3xl border-t border-white/20"
                  >
                     <View className="bg-black/40 pb-10 pt-2">
                        <View className="flex-row justify-between items-center px-6 py-4 border-b border-white/10">
                            <Text className="text-zinc-400 text-sm tracking-wider font-bold">DATE OF BIRTH</Text>
                            <TouchableOpacity 
                                onPress={() => setShowDatePicker(false)}
                                className="bg-white/10 px-4 py-1.5 rounded-full"
                            >
                                <Text className="text-white font-bold text-sm">Done</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View className="items-center justify-center pt-2">
                            <DateTimePicker
                                /* ВАЖЛИВО:
                                  1. value: якщо дата ще не обрана (dobValue === undefined),
                                     ми підставляємо maxDate. Це змушує барабан відразу крутитися
                                     на 12 років назад, а не на сьогодні.
                                */
                                value={dobValue || maxDate} 
                                
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                textColor="white"
                                themeVariant="dark"
                                
                                /* ВАЖЛИВО:
                                  2. maximumDate: це фізичне обмеження. 
                                     Дати новіші за maxDate будуть сірими і неактивними.
                                */
                                maximumDate={maxDate} 
                            />
                        </View>
                     </View>
                  </BlurView>
               </BlurView>
             </Modal>
          ) : (
            <DateTimePicker
              value={dobValue || maxDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={maxDate}
            />
          )
        )}

      </SafeAreaView>
    </View>
  );
}
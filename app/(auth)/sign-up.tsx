import {
  AuthLayout,
  CustomCheckbox,
  CustomInput,
  CustomSelect,
  PrimaryButton,
  SlideUpModal,
} from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LANGUAGES, STUDIOS } from '@/src/constants/auth-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

// --- ВАЛІДАЦІЯ ---
const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "First name can only contain letters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "Last name can only contain letters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  homeStudio: z.string().min(1, { message: "Please select a home studio" }),
  language: z.string().min(1, { message: "Please select a language" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  terms: z.literal(true, { message: "You must agree to the terms" }),
  marketing: z.boolean().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isStudioModalVisible, setStudioModalVisible] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange', 
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      homeStudio: '',
      language: '',
      password: '',
      terms: undefined,
      marketing: false,
    }
  });

  const selectedLanguage = watch('language');
  const selectedStudio = watch('homeStudio');

  const onSubmit = (data: SignUpFormData) => {
    console.log("Form Data:", data);
    router.push('/(auth)/sign-up-step-2');
  };

  const renderStudioItem = ({ item }: { item: typeof STUDIOS[0] }) => {
    const isSelected = selectedStudio === item.name;
    return (
      <TouchableOpacity 
        className="flex-row items-center py-4 border-b border-zinc-800"
        onPress={() => {
          setValue('homeStudio', item.name, { shouldValidate: true });
          setStudioModalVisible(false);
        }}
      >
        <Text style={{ fontSize: 16 }} className={`flex-1 ${isSelected ? 'text-white font-bold' : 'text-zinc-400'}`}>
          {item.name}
        </Text>
        {isSelected && <IconSymbol name="checkmark" size={18} color="white" />}
      </TouchableOpacity>
    );
  };

  const renderLanguageItem = ({ item }: { item: typeof LANGUAGES[0] }) => {
    const isSelected = selectedLanguage === item.name;
    return (
      <TouchableOpacity 
        className="flex-row items-center py-4 border-b border-zinc-800"
        onPress={() => {
          setValue('language', item.name, { shouldValidate: true });
          setLanguageModalVisible(false);
        }}
      >
        <Text style={{ fontSize: 24, marginRight: 12 }}>{item.flag}</Text>
        <Text style={{ fontSize: 16 }} className={`flex-1 ${isSelected ? 'text-white font-bold' : 'text-zinc-400'}`}>
          {item.name}
        </Text>
        {isSelected && <IconSymbol name="checkmark" size={18} color="white" />}
      </TouchableOpacity>
    );
  };

  return (
    <AuthLayout currentStep={1} totalSteps={5}>
      <View className="px-5">
        <Text className="text-white text-2xl font-bold mt-2 mb-8 text-center tracking-wider">
          CREATE YOUR ACCOUNT
        </Text>

        <View className="gap-3">
          <CustomInput
            control={control}
            name="firstName"
            error={errors.firstName}
            placeholder="First Name"
            autoCapitalize="words"
            textContentType="givenName"
            autoComplete="name-given"
          />

          <CustomInput
            control={control}
            name="lastName"
            error={errors.lastName}
            placeholder="Last Name"
            autoCapitalize="words"
            textContentType="familyName"
            autoComplete="name-family"
          />

          <CustomInput
            control={control}
            name="email"
            error={errors.email}
            placeholder="Email"
            type="email"
            showClearButton
          />

          <CustomSelect
            control={control}
            name="homeStudio"
            error={errors.homeStudio}
            placeholder="Choose Home Studio"
            onPress={() => setStudioModalVisible(true)}
          />

          <CustomSelect
            control={control}
            name="language"
            error={errors.language}
            placeholder="Choose Language"
            onPress={() => setLanguageModalVisible(true)}
          />

          <CustomInput
            control={control}
            name="password"
            error={errors.password}
            placeholder="Password"
            type="password"
            helperText="Must contain at least 8 characters including an uppercase letter, a lowercase letter and a number."
          />

          <View className="mt-6 gap-4">
            <CustomCheckbox
              control={control}
              name="terms"
              error={errors.terms}
              label={
                <Text className="text-white" style={{ fontSize: 16, lineHeight: 24 }}>
                  I agree to UN1T's <Text className="underline">Terms and Conditions</Text> and{' '}
                  <Text className="underline">Privacy Policy</Text>
                </Text>
              }
            />

            <CustomCheckbox
              control={control}
              name="marketing"
              label="Opt-in for marketing communications"
            />
          </View>

          <View className="mt-10 mb-10">
            <PrimaryButton title="NEXT" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>

      <SlideUpModal
        visible={isStudioModalVisible}
        onClose={() => setStudioModalVisible(false)}
        title="Choose Home Studio"
        data={STUDIOS}
        renderItem={renderStudioItem}
      />

      <SlideUpModal
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title="Choose Language"
        data={LANGUAGES}
        renderItem={renderLanguageItem}
      />
    </AuthLayout>
  );
}
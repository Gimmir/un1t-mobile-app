import { IconSymbol } from '@/components/ui/icon-symbol';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Contacts from 'expo-contacts';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

// --- КОМПОНЕНТ МОДАЛЬНОГО ВІКНА З ПОШУКОМ ---
const SlideUpModal = ({ 
  visible, 
  onClose, 
  title, 
  data, 
  renderItem,
  searchable = false,
  onSearch 
}: { 
  visible: boolean; 
  onClose: () => void; 
  title: string;
  data: any[];
  renderItem: any;
  searchable?: boolean;
  onSearch?: (text: string) => void;
}) => {
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: Dimensions.get('window').height, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setShowModal(false);
      setSearchText('');
      if (onSearch) onSearch('');
      onClose();
    });
  };

  const handleSearchChange = (text: string) => {
      setSearchText(text);
      if (onSearch) onSearch(text);
  };

  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal} animationType="none" onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={{ opacity: fadeAnim }} className="absolute top-0 bottom-0 left-0 right-0 bg-black/80" />
        </TouchableWithoutFeedback>
        <Animated.View 
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-[#191919] rounded-t-3xl h-[80%] border-t border-zinc-800 w-full overflow-hidden"
        >
           {/* Header */}
           <View className="flex-row items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#191919]">
              <TouchableOpacity onPress={handleClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <IconSymbol name="xmark" size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-white font-bold text-base tracking-wider uppercase">{title}</Text>
              <View className="w-5" /> 
           </View>

           {/* Search Input */}
           {searchable && (
               <View className="px-4 py-3 bg-[#191919] border-b border-zinc-800">
                   <View className="flex-row items-center bg-[#252525] h-12 px-3 rounded-lg border border-zinc-800">
                       <IconSymbol name="magnifyingglass" size={18} color="#71717a" />
                       
                       <TextInput 
                           placeholder="Search contacts..." 
                           placeholderTextColor="#71717a"
                           className="flex-1 text-white ml-2 text-base h-full leading-5"
                           value={searchText}
                           onChangeText={handleSearchChange}
                           autoCorrect={false}
                           style={{ paddingVertical: 0, paddingTop: 0, paddingBottom: 0 }}
                           textAlignVertical="center"
                       />
                       
                       {searchText.length > 0 && (
                           <TouchableOpacity onPress={() => handleSearchChange('')}>
                               <IconSymbol name="xmark.circle.fill" size={16} color="#71717a" />
                           </TouchableOpacity>
                       )}
                   </View>
               </View>
           )}

           <FlatList 
             data={data}
             renderItem={renderItem}
             keyExtractor={(item) => item.id || Math.random().toString()}
             contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 }}
             showsVerticalScrollIndicator={false}
             initialNumToRender={15}
             keyboardShouldPersistTaps="handled"
           />
        </Animated.View>
      </View>
    </Modal>
  );
};

// --- ВАЛІДАЦІЯ ---
const step3Schema = z.object({
  nokFirstName: z.string().min(2, { message: "First name is required" }),
  nokLastName: z.string().min(2, { message: "Last name is required" }),
  nokPhoneNumber: z.string().min(5, { message: "Phone number is required" }),
});

type Step3FormData = z.infer<typeof step3Schema>;

export default function SignUpStep3Screen() {
  const router = useRouter();
  
  // Стан
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [isContactModalVisible, setContactModalVisible] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
    defaultValues: {
      nokFirstName: '',
      nokLastName: '',
      nokPhoneNumber: '',
    }
  });

  // --- ЛОГІКА НАВІГАЦІЇ (ВИПРАВЛЕНО) ---
  const onSubmit = (data: Step3FormData) => {
    console.log("Step 3 (Next of Kin) Data:", data);
    // Перехід на фінальний крок (Sign Waiver)
    router.push('/(auth)/sign-up-step-4'); 
  };

  // --- ЛОГІКА ПОШУКУ ---
  const handleSearch = (text: string) => {
      if (!text.trim()) {
          setFilteredContacts(allContacts);
          return;
      }
      const lowerText = text.toLowerCase();
      const filtered = allContacts.filter(contact => {
          const first = (contact.firstName || '').toLowerCase();
          const last = (contact.lastName || '').toLowerCase();
          const phone = (contact.phoneNumbers?.[0]?.number || '').replace(/\D/g, '');
          return first.includes(lowerText) || last.includes(lowerText) || phone.includes(lowerText);
      });
      setFilteredContacts(filtered);
  };

  // --- ЛОГІКА КОНТАКТІВ ---
  const handleOpenContactPicker = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
          sort: Contacts.SortTypes.FirstName
        });

        if (data.length > 0) {
          const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
          setAllContacts(validContacts);
          setFilteredContacts(validContacts);
          setContactModalVisible(true);
        } else {
          Alert.alert("No contacts found", "Your contact book seems empty.");
        }
      } else {
        Alert.alert("Permission denied", "We need permission to access your contacts.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to load contacts.");
    }
  };

  const handleSelectContact = (contact: any) => {
    const number = contact.phoneNumbers[0]?.number;
    
    if (number) {
        setValue('nokPhoneNumber', number, { shouldValidate: true });
        if (contact.firstName) setValue('nokFirstName', contact.firstName, { shouldValidate: true });
        if (contact.lastName) setValue('nokLastName', contact.lastName, { shouldValidate: true });
    }
    
    setContactModalVisible(false);
  };

  const renderContactItem = ({ item }: { item: any }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers[0] ? item.phoneNumbers[0].number : '';
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();

    return (
      <TouchableOpacity 
        className="flex-row items-center py-4 border-b border-zinc-800"
        onPress={() => handleSelectContact(item)}
      >
        <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mr-4">
             <Text className="text-white font-bold text-lg">
                {(item.firstName?.[0] || item.lastName?.[0] || '#').toUpperCase()}
             </Text>
        </View>
        <View className="flex-1">
            <Text className="text-white font-bold text-base">{fullName || 'Unknown'}</Text>
            <Text className="text-zinc-500 text-sm">{phoneNumber}</Text>
        </View>
        <IconSymbol name="plus" size={18} color="#71717a" />
      </TouchableOpacity>
    );
  };

  const getBorderStyle = (error: any, value: string) => {
    if (error) return 'border-b border-red-500';
    if (value && value.length > 0) return 'border-b border-white';
    return 'border-b border-transparent';
  };

  const getTextColor = (error: any) => (error ? 'text-red-500' : 'text-white');
  const baseInputStyle = "bg-[#252525] px-4 flex-row items-center h-[52px]";

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
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" /> 
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" /> 
            <View className="w-8 h-1 bg-white rounded-full" />     
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" /> 
            <View className="w-1.5 h-1 bg-zinc-600 rounded-full" /> 
          </View>
          
          <View className="w-6" />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-5">
              <Text className="text-white text-2xl font-bold mt-2 text-center tracking-wider uppercase">
                NEXT OF KIN
              </Text>
              
              <Text className="text-zinc-500 text-sm text-center mt-2 mb-8">
                Add contact in case of emergency
              </Text>

              <View className="gap-3">
                {/* 1. First Name */}
                <Controller
                  control={control}
                  name="nokFirstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.nokFirstName, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="First Name"
                          placeholderTextColor="#52525b"
                          className={`flex-1 ${getTextColor(errors.nokFirstName)}`}
                          style={{ fontSize: 16 }}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.nokFirstName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.nokFirstName.message}</Text>}
                    </View>
                  )}
                />

                {/* 2. Last Name */}
                <Controller
                  control={control}
                  name="nokLastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} ${getBorderStyle(errors.nokLastName, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Last Name"
                          placeholderTextColor="#52525b"
                          className={`flex-1 ${getTextColor(errors.nokLastName)}`}
                          style={{ fontSize: 16 }}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.nokLastName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.nokLastName.message}</Text>}
                    </View>
                  )}
                />

                {/* 3. Phone Number */}
                <Controller
                  control={control}
                  name="nokPhoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View className={`${baseInputStyle} justify-between ${getBorderStyle(errors.nokPhoneNumber, value)}`}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Phone Number"
                          placeholderTextColor="#52525b"
                          keyboardType="phone-pad"
                          className={`flex-1 ${getTextColor(errors.nokPhoneNumber)}`}
                          style={{ fontSize: 16 }}
                        />
                        <TouchableOpacity onPress={handleOpenContactPicker}>
                            <IconSymbol name="person.crop.circle.badge.plus" size={22} color="#71717a" />
                        </TouchableOpacity>
                      </View>
                      {errors.nokPhoneNumber && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.nokPhoneNumber.message}</Text>}
                    </View>
                  )}
                />

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

        {/* Modal for Contacts */}
        <SlideUpModal 
            visible={isContactModalVisible}
            onClose={() => setContactModalVisible(false)}
            title="Pick a Contact"
            data={filteredContacts}
            renderItem={renderContactItem}
            searchable={true}
            onSearch={handleSearch}
        />

      </SafeAreaView>
    </View>
  );
}
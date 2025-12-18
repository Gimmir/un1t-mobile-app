import { IconSymbol } from '@/components/ui/icon-symbol';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface SlideUpModalProps<T extends { id: string | number }> {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  searchable?: boolean;
  onSearch?: (text: string) => void;
  height?: string;
}

export function SlideUpModal<T extends { id: string | number }>({
  visible,
  onClose,
  title,
  data,
  renderItem,
  searchable = false,
  onSearch,
  height = '70%',
}: SlideUpModalProps<T>) {
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }),
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
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="absolute top-0 bottom-0 left-0 right-0 bg-black/80"
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{ 
            transform: [{ translateY: slideAnim }],
          }}
          className={`bg-[#191919] rounded-t-3xl ${height === '80%' ? 'h-[80%]' : 'h-[70%]'} border-t border-zinc-800 w-full overflow-hidden`}
        >
          <View className="flex-row items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#191919]">
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-base tracking-wider uppercase">{title}</Text>
            <View className="w-5" />
          </View>

          {searchable && (
            <View className="px-6 pt-4 pb-2">
              <View className="bg-[#252525] px-4 flex-row items-center h-12 rounded-lg">
                <IconSymbol name="magnifyingglass" size={18} color="#52525b" />
                <TextInput
                  value={searchText}
                  onChangeText={handleSearchChange}
                  placeholder="Search..."
                  placeholderTextColor="#52525b"
                  className="flex-1 text-white ml-2"
                  style={{ fontSize: 16 }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearchChange('')}>
                    <IconSymbol name="xmark" size={16} color="#52525b" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: searchable ? 10 : 10,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

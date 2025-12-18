import { COUNTRY_NAMES } from '@/constants/country-names';
import { BlurView } from 'expo-blur';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function CountryPickerModal(props: {
  visible: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const { visible, selectedCode, onSelect, onClose } = props;
  const [countrySearch, setCountrySearch] = useState('');

  if (!visible) return null;

  const countryOptions = useMemo(
    () =>
      Object.entries(COUNTRY_NAMES)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filteredCountryOptions = useMemo(() => {
    if (!countrySearch.trim()) {
      return countryOptions;
    }
    const lower = countrySearch.toLowerCase();
    return countryOptions.filter(
      (option) => option.name.toLowerCase().includes(lower) || option.code.toLowerCase().includes(lower)
    );
  }, [countryOptions, countrySearch]);

  const handleClose = () => {
    setCountrySearch('');
    onClose();
  };

  const handleSelect = (code: string) => {
    setCountrySearch('');
    onSelect(code);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <BlurView intensity={20} tint="dark" style={styles.backdrop}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />

          <View style={styles.wrapper}>
            <BlurView intensity={80} tint="dark" className="overflow-hidden rounded-3xl border border-white/20">
              <View className="bg-black/40 pb-6 pt-2">
                <View className="flex-row justify-between items-center px-6 py-4 border-b border-white/10">
                  <Text className="text-zinc-400 text-sm tracking-wider font-bold">COUNTRY</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="bg-white/10 px-4 py-1.5 rounded-full"
                  >
                    <Text className="text-white font-bold text-sm">Close</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.searchWrap}>
                  <TextInput
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                    placeholder="Search country"
                    placeholderTextColor="#6B7280"
                    style={styles.searchInput}
                    autoFocus
                  />
                </View>

                <ScrollView
                  style={{ maxHeight: 300 }}
                  contentContainerStyle={styles.listContent}
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredCountryOptions.map((option) => {
                    const selected = selectedCode === option.code;
                    return (
                      <TouchableOpacity
                        key={option.code}
                        style={[styles.item, selected && styles.itemSelected]}
                        onPress={() => handleSelect(option.code)}
                      >
                        <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                          {option.name}
                        </Text>
                        <Text style={[styles.itemCode, selected && styles.itemTextSelected]}>
                          {option.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </BlurView>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  itemSelected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  itemText: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '500',
  },
  itemTextSelected: {
    color: '#FACC15',
  },
  itemCode: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '700',
  },
});

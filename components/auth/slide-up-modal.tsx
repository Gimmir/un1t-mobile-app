import { IconSymbol } from '@/components/ui/icon-symbol';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SlideUpModalProps<T extends { id: string | number }> {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  isLoading?: boolean;
  emptyText?: string;
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
  isLoading = false,
  emptyText,
  searchable = false,
  onSearch,
  height = '70%',
}: SlideUpModalProps<T>) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearchText('');
      onSearch?.('');
    }
  }, [onSearch, visible]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearch) onSearch(text);
  };

  const maxHeight = useMemo(() => {
    const ratio = height === '80%' ? 0.8 : 0.7;
    return Math.round(Dimensions.get('window').height * ratio);
  }, [height]);

  const normalizedTitle = useMemo(() => String(title ?? '').toUpperCase(), [title]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={[styles.card, { maxHeight }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{normalizedTitle}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={18} color="#E4E4E7" />
            </TouchableOpacity>
          </View>

          {searchable ? (
            <View style={styles.searchBlock}>
              <View style={styles.searchInput}>
                <IconSymbol name="magnifyingglass" size={18} color="#71717A" />
                <TextInput
                  value={searchText}
                  onChangeText={handleSearchChange}
                  placeholder="Search..."
                  placeholderTextColor="#71717A"
                  style={styles.searchText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchText.length > 0 ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => handleSearchChange('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <IconSymbol name="xmark" size={16} color="#71717A" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyBlock}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.emptyText}>{emptyText ?? 'Nothing here yet.'}</Text>
                )}
              </View>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  searchBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#111113',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 6,
  },
  emptyBlock: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
} as const;

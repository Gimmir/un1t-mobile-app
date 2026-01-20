import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { useEffect, useMemo, useState } from 'react';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';
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
      <View style={styles.root}>
        <View style={styles.backdrop}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFillObject} />
          <Pressable style={styles.overlay} onPress={onClose} />
        </View>

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
                <IconSymbol name="magnifyingglass" size={18} color={ colors.text.muted } />
                <TextInput
                  value={searchText}
                  onChangeText={handleSearchChange}
                  placeholder="Search..."
                  placeholderTextColor={ colors.text.muted }
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
                    <IconSymbol name="xmark" size={16} color={ colors.text.muted } />
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
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
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
    borderBottomColor: colors.surface.elevated,
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
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
    borderColor: colors.surface.elevated,
  },
  searchBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: '#111113',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  listContent: {
    paddingVertical: 6,
  },
  emptyBlock: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
} as const;

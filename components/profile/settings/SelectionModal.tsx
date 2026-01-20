import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export type SelectionOption = {
  key: string;
  label: string;
};

export function SelectionModal(props: {
  visible: boolean;
  title: string;
  selectedKey: string;
  options: SelectionOption[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const { visible, title, selectedKey, options, onSelect, onClose } = props;

  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <BlurView intensity={20} tint="dark" style={styles.backdrop}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />

        <View style={styles.wrapper}>
          <BlurView intensity={80} tint="dark" style={styles.modalCard}>
            <View style={styles.modalInner}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeChip} activeOpacity={0.8}>
                  <Text style={styles.closeChipText}>Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ maxHeight: 340 }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option) => {
                  const selected = selectedKey === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[styles.item, selected && styles.itemSelected]}
                      onPress={() => onSelect(option.key)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                        {option.label}
                      </Text>
                      {selected ? <Ionicons name="checkmark" size={18} color="#FACC15" /> : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </BlurView>
        </View>
      </BlurView>
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
    borderRadius: 22,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  modalInner: {
    backgroundColor: 'rgba(0,0,0,0.40)',
    paddingBottom: 10,
    paddingTop: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  modalTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
  closeChip: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  closeChipText: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  itemSelected: {
    borderColor: 'rgba(250,204,21,0.35)',
    backgroundColor: 'rgba(250,204,21,0.08)',
  },
  itemText: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  itemTextSelected: {
    color: '#FACC15',
  },
});
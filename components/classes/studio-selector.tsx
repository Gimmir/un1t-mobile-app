import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

type StudioOption = {
  id: string;
  title: string;
};

type StudioSelectorProps = {
  studios: StudioOption[];
  selectedStudioId: string | null;
  onSelectStudio: (studioId: string) => void;
  isLoading?: boolean;
  onSchedulePress?: () => void;
};

export const StudioSelector: React.FC<StudioSelectorProps> = ({
  studios,
  selectedStudioId,
  onSelectStudio,
  isLoading,
  onSchedulePress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTitle = useMemo(() => {
    if (isLoading) return 'Loading…';
    return studios.find((studio) => studio.id === selectedStudioId)?.title ?? studios[0]?.title ?? '—';
  }, [isLoading, selectedStudioId, studios]);

  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          onPress={() => setIsOpen(true)}
          style={styles.studioSection}
        >
          <Text style={styles.studioLabel}>STUDIO</Text>
          <View style={styles.studioRow}>
            <Text style={styles.studioName} numberOfLines={1}>
              {selectedTitle}
            </Text>
            <Ionicons name="chevron-down" size={16} color={ colors.text.muted } />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          onPress={() => {
            if (!onSchedulePress) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSchedulePress();
          }}
          style={[styles.scheduleButton, !onSchedulePress && styles.scheduleButtonDisabled]}
          disabled={!onSchedulePress}
        >
          <Text style={styles.scheduleButtonText}>MY SCHEDULE</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)} />
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SELECT STUDIO</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.modalClose}>
              <Ionicons name="close" size={18} color="#E4E4E7" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalList}>
            {studios.map((studio, index) => {
              const isSelected = studio.id === selectedStudioId || (!selectedStudioId && index === 0);
              return (
                <TouchableOpacity
                  key={studio.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    onSelectStudio(studio.id);
                    setIsOpen(false);
                  }}
                  style={[styles.modalRow, isSelected && styles.modalRowSelected]}
                >
                  <Text style={[styles.modalRowText, isSelected && styles.modalRowTextSelected]}>
                    {studio.title}
                  </Text>
                  {isSelected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  studioSection: {
    flex: 1,
  },
  studioLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: 4,
    letterSpacing: 1,
  },
  studioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studioName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    maxWidth: '88%',
  },
  scheduleButton: {
    backgroundColor: '#ffffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  scheduleButtonDisabled: {
    opacity: 0.6,
  },
  scheduleButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface.app,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    overflow: 'hidden',
    maxHeight: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surface.elevated,
  },
  modalList: {
    paddingVertical: 6,
  },
  modalRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  modalRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modalRowText: {
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.4,
  },
  modalRowTextSelected: {
    color: '#FFFFFF',
  },
});

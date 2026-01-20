import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type InfoModalShellProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function InfoModalShell({
  visible,
  title,
  onClose,
  children,
  contentContainerStyle,
}: InfoModalShellProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFillObject} />
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.card}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              <Text
                style={styles.headerTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {title.toUpperCase()}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={onClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <ScrollView
              contentContainerStyle={[styles.content, contentContainerStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  safeArea: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surface.panel,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 26,
    gap: 18,
  },
});

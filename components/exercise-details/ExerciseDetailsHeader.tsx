import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  DimensionValue,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

type ExerciseDetailsHeaderProps = {
  title: string;
  tabs?: readonly string[];
  activeTab?: number;
  onTabPress?: (index: number) => void;
  onBack: () => void;
  paddingTop: number;
  onLayout: (event: LayoutChangeEvent) => void;
  showTabs?: boolean;
};

export function ExerciseDetailsHeader({
  title,
  tabs = [],
  activeTab = 0,
  onTabPress,
  onBack,
  paddingTop,
  onLayout,
  showTabs = true,
}: ExerciseDetailsHeaderProps) {
  const shouldRenderTabs = showTabs && tabs.length > 0 && typeof onTabPress === 'function';
  const handleTabPress = onTabPress ?? (() => {});
  const safeActiveTab = tabs.length > 0 ? Math.min(activeTab, tabs.length - 1) : 0;
  const tabCount = Math.max(tabs.length, 1);
  const indicatorWidth = `${100 / tabCount}%` as DimensionValue;
  const indicatorLeft = `${(100 / tabCount) * safeActiveTab}%` as DimensionValue;
  const containerStyle = [styles.header, { paddingTop }, !showTabs && styles.headerNoTabs];

  const headerContent = (
    <>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>
          {title.toUpperCase()}
        </Text>
      </View>

      {shouldRenderTabs ? (
        <View style={styles.repTabsWrapper}>
          <View style={styles.repTabs}>
            {tabs.map((label, index) => {
              const isActive = index === safeActiveTab;
              return (
                <TouchableOpacity
                  key={label}
                  style={styles.repTab}
                  activeOpacity={0.7}
                  onPress={() => handleTabPress(index)}
                >
                  <Text style={[styles.repTabText, isActive && styles.repTabTextActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.repTabsBar}>
            <View style={styles.repTabsLine} />
            <View style={[styles.repTabsIndicator, { width: indicatorWidth, left: indicatorLeft }]} />
          </View>
        </View>
      ) : null}
    </>
  );

  if (Platform.OS === 'android') {
    return (
      <View style={containerStyle} onLayout={onLayout}>
        {headerContent}
      </View>
    );
  }

  return (
    <BlurView intensity={24} tint="dark" style={containerStyle} onLayout={onLayout}>
      {headerContent}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  headerNoTabs: {
    paddingBottom: 16,
  },
  headerTopRow: {
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    fontSize: typography.size.xl,
    letterSpacing: 2,
    textAlign: 'center',
    paddingHorizontal: 60,
  },
  repTabs: {
    flexDirection: 'row',
    width: '100%',
  },
  repTabsWrapper: {
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  repTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  repTabText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  repTabTextActive: {
    color: '#FFFFFF',
  },
  repTabsBar: {
    position: 'relative',
    height: 2,
    marginTop: 8,
  },
  repTabsLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0.5,
    height: 1,
    backgroundColor: colors.surface.panel,
  },
  repTabsIndicator: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FFFFFF',
  },
});

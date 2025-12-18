import ClassesIconSVG from '@/assets/icons/classes_icon.svg';
import HomeIconSVG from '@/assets/icons/home_icon.svg';
import ProfileIconSVG from '@/assets/icons/profile_icon.svg';
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedTabButton } from './animated-tab-button';
import { CIRCLE_SIZE } from './constants';
import { GlassPill } from './glass-pill';
import { styles } from './styles';
import { TabConfig } from './types';

interface SplitTabBarProps {
  state: any;
  navigation: any;
}

const leftTabs: TabConfig[] = [
  { name: 'index', label: 'Home', component: HomeIconSVG },
  { name: 'classes', label: 'Classes', component: ClassesIconSVG },
];

const rightTab: TabConfig = {
  name: 'profile',
  label: 'Profile',
  component: ProfileIconSVG,
};

export const SplitTabBar: React.FC<SplitTabBarProps> = ({ state, navigation }) => {
  const navigateTo = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const leftPillWidth = (() => {
    const perTabWidth = 72;
    const horizontalPadding = 24;
    const baseWidth = leftTabs.length * perTabWidth + horizontalPadding;
    const maxWidth = Math.max(0, screenWidth - 40 - CIRCLE_SIZE - 12);
    return Math.min(baseWidth, maxWidth || baseWidth);
  })();

  const renderContent = (tabs: TabConfig[]) => (
    <>
      {tabs.map((tab) => {
        const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
        const focused = state.index === routeIndex;

        return (
          <AnimatedTabButton
            key={tab.name}
            label={tab.label}
            focused={focused}
            onPress={() => navigateTo(tab.name)}
            CustomIconComponent={tab.component}
          />
        );
      })}
    </>
  );

  return (
    <View style={[styles.floatingContainer, { bottom: Math.max(0, insets.bottom + 0) }]}>
      <GlassPill isPill={true} style={{ width: leftPillWidth }}>
        {renderContent(leftTabs)}
      </GlassPill>

      <GlassPill isPill={false}>{renderContent([rightTab])}</GlassPill>
    </View>
  );
};

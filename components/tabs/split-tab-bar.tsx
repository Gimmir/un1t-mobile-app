import ClassesIconSVG from '@/assets/icons/classes_icon.svg';
import HomeIconSVG from '@/assets/icons/home_icon.svg';
import PerformanceIconSVG from '@/assets/icons/performance_icon.svg';
import ProfileIconSVG from '@/assets/icons/profile_icon.svg';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedTabButton } from './animated-tab-button';
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
  { name: 'performance', label: 'Performance', component: PerformanceIconSVG },
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

  const renderContent = (tabs: TabConfig[]) => (
    <>
      {tabs.map((tab) => {
        const routeIndex = state.routes.findIndex((r: any) => r.name === tab.name);
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
      <GlassPill isPill={true}>{renderContent(leftTabs)}</GlassPill>

      <GlassPill isPill={false}>{renderContent([rightTab])}</GlassPill>
    </View>
  );
};

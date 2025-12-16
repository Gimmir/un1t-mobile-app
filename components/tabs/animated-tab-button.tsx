import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';
import { CustomIconType } from './types';

interface AnimatedTabButtonProps {
  label: string;
  focused: boolean;
  onPress: () => void;
  CustomIconComponent: CustomIconType;
}

export const AnimatedTabButton: React.FC<AnimatedTabButtonProps> = ({
  label,
  focused,
  onPress,
  CustomIconComponent,
}) => {
  const isProfile = label === 'Profile';
  const scale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [focused]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value > 0.01 ? 1 : 0,
    };
  });

  const buttonStyle = isProfile ? styles.profileTabButton : styles.defaultTabButton;
  const contentColor = focused ? '#FFFFFF' : '#A1A1AA';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={buttonStyle}>
      <Animated.View style={[styles.animatedFocusBackgroundV3, animatedBackgroundStyle]} />

      <View style={styles.tabContentWrapperV2}>
        <CustomIconComponent color={contentColor} width={24} height={24} />
        <Text style={[styles.tabLabel, { color: contentColor }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

import React, { useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';
import { CustomIconType } from './types';
import { colors } from '@/src/theme/colors';

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
  }, [focused, scale]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value > 0.01 ? 1 : 0,
    };
  });

  const buttonStyle = isProfile ? styles.profileTabButton : styles.defaultTabButton;
  const contentColor = focused ? '#FFFFFF' : colors.text.secondary;
  const iconOpacity = focused ? 1 : 0.6;

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={buttonStyle}>
      <Animated.View style={[styles.animatedFocusBackgroundV3, animatedBackgroundStyle]} />

      <View style={styles.tabContentWrapperV2}>
        <View style={{ opacity: iconOpacity }}>
          <CustomIconComponent color={contentColor} width={24} height={24} />
        </View>
        <Text
          style={[styles.tabLabel, { color: contentColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling={false}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

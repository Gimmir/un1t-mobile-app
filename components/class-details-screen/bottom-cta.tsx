import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export function ClassDetailsBottomCta({
  paddingBottom,
  disabled,
  isCancel,
  backgroundColor,
  borderColor,
  textColor,
  label,
  onPress,
}: {
  paddingBottom: number;
  disabled: boolean;
  isCancel: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={[styles.bottomCtaWrap, { paddingBottom }]}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)', '#000000']}
        locations={[0, 0.35, 1]}
        style={styles.bottomFade}
      />
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.ctaButton,
          {
            backgroundColor,
            borderWidth: 1,
            borderColor,
            ...(isCancel
              ? {
                  shadowOpacity: 0,
                  elevation: 0,
                }
              : null),
          },
          disabled && styles.ctaButtonDisabled,
        ]}
      >
        <Text style={[styles.ctaText, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}


import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { typography } from '@/src/theme/typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: typography.size.lg,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: typography.size.lg,
    lineHeight: 24,
    fontWeight: typography.weight.semibold,
  },
  title: {
    fontSize: typography.size.hero,
    fontWeight: typography.weight.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: typography.size.lg,
    color: '#0a7ea4',
  },
});

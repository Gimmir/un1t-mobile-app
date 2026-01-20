export const typography = {
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    hero: 32,
    display: 42,
  },
  weight: {
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
} as const;

export type TypographyScale = typeof typography;

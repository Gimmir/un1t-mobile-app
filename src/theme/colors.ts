export const colors = {
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
    placeholder: '#52525B',
    inverse: '#191919',
  },
  surface: {
    app: '#191919',
    base: '#101012',
    elevated: '#1F1F23',
    panel: '#27272A',
    deep: '#0E0E10',
  },
  border: {
    strong: '#3F3F46',
  },
} as const;

export type AppColors = typeof colors;

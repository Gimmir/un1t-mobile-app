import { BlurTint } from 'expo-blur';
import { Platform } from 'react-native';

export const TAB_HEIGHT = 64;
export const PILL_WIDTH = 240;
export const CIRCLE_SIZE = 64;

export const isAndroid = Platform.OS === 'android';

export const getGlassTint = (): BlurTint => {
  return 'dark';
};

export const glassTint = getGlassTint();

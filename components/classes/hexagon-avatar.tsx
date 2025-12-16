import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Polygon, Image as SvgImage } from 'react-native-svg';

interface HexagonAvatarProps {
  uri: string;
  size?: number;
  isIcon?: boolean;
}

export const HexagonAvatar: React.FC<HexagonAvatarProps> = ({ uri, size = 40, isIcon = false }) => {
  const points = `
    ${size * 0.5},${size * 0.067}
    ${size * 0.933},${size * 0.25}
    ${size * 0.933},${size * 0.75}
    ${size * 0.5},${size * 0.933}
    ${size * 0.067},${size * 0.75}
    ${size * 0.067},${size * 0.25}
  `;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id="hexClip">
            <Polygon points={points} />
          </ClipPath>
        </Defs>

        {isIcon ? (
          <Polygon points={points} fill="#27272A" />
        ) : (
          <SvgImage
            href={{ uri }}
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#hexClip)"
          />
        )}
      </Svg>

      {isIcon && (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="person-outline" size={size * 0.5} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

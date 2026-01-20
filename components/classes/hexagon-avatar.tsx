import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Polygon, Image as SvgImage } from 'react-native-svg';
import { colors } from '@/src/theme/colors';

interface HexagonAvatarProps {
  uri: string;
  size?: number;
  isIcon?: boolean;
}

export const HexagonAvatar: React.FC<HexagonAvatarProps> = ({ uri, size = 40, isIcon = false }) => {
  const radius = size / 2;
  const points = Array.from({ length: 6 })
    .map((_, index) => {
      const angle = Math.PI / 6 + (index * Math.PI) / 3; // 30° offset keeps flat top orientation
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id="hexClip">
            <Polygon points={points} />
          </ClipPath>
        </Defs>

        {isIcon ? (
          <Polygon points={points} fill={ colors.surface.panel } />
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
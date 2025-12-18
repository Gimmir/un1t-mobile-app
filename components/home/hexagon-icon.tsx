import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface HexagonIconProps {
  icon: any;
  library: 'Ionicons' | 'MaterialCommunityIcons';
  size?: 'small' | 'medium' | 'large';
}

export function HexagonIcon({ icon, library, size = 'large' }: HexagonIconProps) {
  const sizeMap = {
    small: { hex: 18, icon: 10, container: 18 },
    medium: { hex: 28, icon: 16, container: 30 },
    large: { hex: 54, icon: 24, container: 64 },
  } as const;
  const { hex, icon: iconSize, container } = sizeMap[size];

  return (
    <View style={[styles.hexContainer, { width: container, height: container }]}>
      <View style={styles.hexLayer}>
        <MaterialCommunityIcons name="hexagon" size={hex} color="white" />
      </View>
      <View style={styles.hexLayer}>
        {library === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={icon} size={iconSize} color="#191919" />
        ) : (
          <Ionicons name={icon} size={iconSize} color="#191919" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hexContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

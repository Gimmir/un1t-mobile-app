import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface HexagonIconProps {
  icon: any;
  library: 'Ionicons' | 'MaterialCommunityIcons';
  size?: 'small' | 'large';
}

export function HexagonIcon({ icon, library, size = 'large' }: HexagonIconProps) {
  const isSmall = size === 'small';
  const hexSize = isSmall ? 18 : 54;
  const iconSize = isSmall ? 10 : 24;
  const containerSize = isSmall ? 18 : 64;

  return (
    <View style={[styles.hexContainer, { width: containerSize, height: containerSize }]}>
      <View style={styles.hexLayer}>
        <MaterialCommunityIcons name="hexagon" size={hexSize} color="white" />
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

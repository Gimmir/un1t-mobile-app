import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { HexagonIcon } from './hexagon-icon';

export function PowerCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>CURRENT PHASE</Text>
        <Text style={styles.cardTitle}>POWER</Text>
      </View>

      <View style={styles.dividerHorizontal} />

      <View style={styles.statsRow}>
        <View style={styles.colContainer}>
          <HexagonIcon icon="dumbbell" library="MaterialCommunityIcons" />

          <View style={styles.labelContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>WEEK 3</Text>
              <Ionicons name="help-circle" size={12} color="#52525b" style={{ marginLeft: 4 }} />
            </View>
          </View>

          <Text style={styles.mainValue}>REPS 6-8</Text>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.colContainer}>
          <HexagonIcon icon="flame" library="Ionicons" />

          <View style={styles.labelContainer}>
            <Text style={styles.metaText} numberOfLines={2}>
              DAILY CALORIE INTAKE
            </Text>
          </View>

          <View style={styles.balancedRow}>
            <View style={{ width: 14, marginLeft: 6 }} />
            <Text style={styles.mainValue}>2185</Text>
            <MaterialCommunityIcons
              name="pencil"
              size={14}
              color="#52525b"
              style={{ marginLeft: 6 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    backgroundColor: '#202020',
    borderRadius: 12,
    paddingVertical: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: '#3f3f46',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
  },
  colContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: '#3f3f46',
    alignSelf: 'center',
  },
  labelContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
    paddingHorizontal: 4,
  },
  metaText: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  balancedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 2,
  },
  mainValue: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
    textAlign: 'center',
  },
});

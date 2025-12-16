import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonAvatar } from './hexagon-avatar';
import { ClassItem } from './types';

export const ClassCard: React.FC<ClassItem> = ({ time, name, trainer, status, avatar }) => {
  const renderAvatar = () => {
    return (
      <View style={styles.hexagonWrapper}>
        <HexagonAvatar uri={avatar} size={40} isIcon={status === 'FULL'} />
      </View>
    );
  };

  const renderBadge = () => {
    if (status === 'WAITLIST') {
      return (
        <View style={styles.badgeWaitlist}>
          <Text style={styles.badgeText}>WAITLIST</Text>
        </View>
      );
    }
    if (status === 'FULL') {
      return (
        <View style={styles.badgeFull}>
          <Text style={styles.badgeText}>CLASS IS FULL</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity style={styles.classCard}>
        <Text style={styles.classTime}>{time}</Text>

        <View style={styles.classInfo}>
          <Text style={styles.className}>{name}</Text>
          <View style={styles.trainerRow}>
            {renderAvatar()}
            <Text style={styles.trainerName}>{trainer}</Text>
          </View>
          {renderBadge()}
        </View>

        <Ionicons name="chevron-forward" size={24} color="#52525B" />
      </TouchableOpacity>

      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  classTime: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 60,
  },
  classInfo: {
    flex: 1,
    marginLeft: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hexagonWrapper: {
    marginRight: 12,
  },
  trainerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  badgeWaitlist: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeFull: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#27272A',
    marginHorizontal: 16,
  },
});

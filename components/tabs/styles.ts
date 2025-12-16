import { StyleSheet } from 'react-native';
import { CIRCLE_SIZE, PILL_WIDTH, TAB_HEIGHT } from './constants';

export const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9999,
  },

  blurBase: {
    overflow: 'hidden',
    backgroundColor: 'rgba(25, 25, 25, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  androidFallback: {
    backgroundColor: 'rgba(25, 25, 25, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    elevation: 10,
  },
  pillShape: {
    borderRadius: 100,
    height: TAB_HEIGHT,
    width: PILL_WIDTH,
  },
  circleShape: {
    borderRadius: 100,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...StyleSheet.absoluteFillObject,
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },

  defaultTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
    borderRadius: 100,
    overflow: 'hidden',
  },
  profileTabButton: {
    width: CIRCLE_SIZE,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 100,
    overflow: 'hidden',
  },

  tabContentWrapperV2: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },

  animatedFocusBackgroundV3: {
    position: 'absolute',
    height: '90%',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    zIndex: 1,
    alignSelf: 'center',
  },

  tabLabel: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '500',
  },
});

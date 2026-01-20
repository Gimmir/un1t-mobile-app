import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.55,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tabsRow: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabUnderline: {
    marginTop: 10,
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: '#FFFFFF',
  },
  tabsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  helperBlock: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    alignItems: 'center',
  },
  helperTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  helperText: {
    marginTop: 10,
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    justifyContent: 'center',
  },
  emptyPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  emptyBlur: {
    borderRadius: 18,
  },
  emptyContent: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    paddingTop: 24,
  },
  emptyKicker: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  emptySubtitle: {
    marginTop: 10,
    color: '#E4E4E7',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    lineHeight: 20,
    maxWidth: 320,
  },
  emptyCta: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyCtaText: {
    color: '#000000',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});

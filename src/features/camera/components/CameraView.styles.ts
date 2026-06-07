import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  // Permissions
  permissionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPaddingHorizontal,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  permissionsTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  permissionsText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Camera viewfinder
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Grid overlay (Stitch: subtle 3-rule guide)
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  gridRows: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  gridLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  gridCols: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  gridLineVertical: {
    height: '100%',
    width: 1,
  },

  // Vignette: radial gradient from center transparent to edges dark
  vignette: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
    // Simulate vignette using semi-transparent edges
    backgroundColor: 'transparent',
    borderWidth: 60,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 0,
  },

  // Top controls (Stitch: top-0 px-24 pt-12)
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  // Stitch: w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md text-white
  topIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(248,251,240,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIconText: {
    fontSize: 18,
    color: colors.white,
  },
  // Stitch: bg-surface/20 backdrop-blur-md px-4 py-2 rounded-full
  brandPill: {
    backgroundColor: 'rgba(248,251,240,0.20)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
  },
  brandText: {
    ...typography.labelLg,
    color: colors.white,
    letterSpacing: 4,
    opacity: 0.8,
  },

  // Bottom area
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: spacing.xl,
    // Stitch: bg-gradient-to-t from-black/40 to-transparent
    backgroundColor: 'rgba(0,0,0,0.0)',
  },

  // Mode toggle (Stitch: flex justify-center gap-8 text-white/60)
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing[10], // ~40px, Stitch mb-10
  },
  modeBtn: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  modeBtnText: {
    ...typography.labelLg,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  modeBtnActive: {
    color: colors.white,
  },
  // Stitch: 4px dot below active mode
  modeDot: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryLight,
  },

  // Capture cluster (Stitch: flex items-center justify-around px-24)
  captureCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },

  // Gallery preview (Stitch: w-14 h-14 rounded-lg border-2 border-white/40)
  galleryPreview: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  galleryPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Shutter outer ring (Stitch: w-24 h-24 border-[3px] border-white/90 shutter-glow)
  shutterOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.4,
    elevation: 8,
  },
  // Stitch: w-20 h-20 bg-primary-container (matcha green)
  shutterInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight, // #a4c639
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Stitch inner: transparent div with slight border
  shutterCore: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: 'rgba(164,198,57,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Flip button (Stitch: w-14 h-14 rounded-full bg-surface/20)
  flipBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(248,251,240,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIcon: {
    fontSize: 22,
    color: colors.white,
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenPaddingHorizontal,
    gap: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captionInput: {
    ...typography.bodyMd,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  progressText: {
    ...typography.labelMd,
    color: colors.white,
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  discardBtn: { flex: 1 },
  shareBtn: { flex: 2 },
});

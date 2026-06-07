import { Button } from '@/components/ui/Button';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera } from '../hooks/useCamera';

// ─── Camera UI (matches Stitch Máy ảnh screen exactly) ───────────────────────
export function CameraView() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const camera = useCamera();
  const { createPost, isLoading: isPosting, uploadProgress } = useCreatePost();
  const [caption, setCaption] = useState('');
  const [flash, setFlash] = useState(false);
  const [activeMode, setActiveMode] = useState<'photo' | 'video'>('photo');

  // ─── Permissions screen ──────────────────────────────────────────────────
  if (!camera.hasPermissions) {
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionsTitle}>Cần quyền truy cập Camera</Text>
        <Text style={styles.permissionsText}>
          NaiPoMemories cần quyền truy cập camera để chụp ảnh và quay video.
        </Text>
        <Button label="Cấp quyền" onPress={camera.requestPermissions} />
      </View>
    );
  }

  // ─── Preview screen ───────────────────────────────────────────────────────
  if (camera.capturedMedia) {
    const handlePost = async () => {
      if (!user) return;
      try {
        await createPost({
          userId: user.uid,
          localUri: camera.capturedMedia!.uri,
          mediaType: camera.capturedMedia!.type === 'photo' ? 'image' : 'video',
          duration: camera.capturedMedia!.duration,
          caption: caption.trim(),
        });
        camera.discardMedia();
        setCaption('');
      } catch (e) {
        console.error('Error during post sharing:', e);
        Alert.alert('Lỗi', 'Không thể chia sẻ. Vui lòng thử lại.');
      }
    };

    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: camera.capturedMedia.uri }}
          style={styles.preview}
          resizeMode="cover"
        />
        <View style={[styles.previewOverlay, { paddingBottom: insets.bottom + spacing.lg }]}>
          <TextInput
            style={styles.captionInput}
            placeholder="Thêm chú thích..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={200}
          />
          {uploadProgress !== null && (
            <Text style={styles.progressText}>Đang tải... {uploadProgress}%</Text>
          )}
          <View style={styles.previewActions}>
            <Button
              label="Hủy"
              variant="ghost"
              onPress={camera.discardMedia}
              style={styles.discardBtn}
            />
            <Button
              label="Chia sẻ ✨"
              onPress={handlePost}
              isLoading={isPosting}
              style={styles.shareBtn}
            />
          </View>
        </View>
      </View>
    );
  }

  // ─── Camera Viewfinder (matches Stitch Máy ảnh screen) ───────────────────
  const topPadding = insets.top + spacing.md;

  return (
    <View style={styles.cameraContainer}>
      {/* Live viewfinder */}
      <ExpoCameraView
        ref={camera.cameraRef}
        style={StyleSheet.absoluteFill}
        facing={camera.facing}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mode={activeMode as any}
      />

      {/* Grid overlay (Stitch: 2 vertical + 2 horizontal at 33% opacity 10%) */}
      <View style={styles.gridOverlay} pointerEvents="none">
        <View style={styles.gridRows}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>
        <View style={styles.gridCols}>
          <View style={[styles.gridLine, styles.gridLineVertical]} />
          <View style={[styles.gridLine, styles.gridLineVertical]} />
        </View>
      </View>

      {/* Vignette overlay */}
      <View style={styles.vignette} pointerEvents="none" />

      {/* ── Top Controls (Stitch: flash | MOMENTS | close) ── */}
      <View style={[styles.topControls, { paddingTop: topPadding }]}>
        {/* Flash toggle */}
        <Pressable
          onPress={() => setFlash((f) => !f)}
          style={styles.topIconBtn}
        >
          <Text style={styles.topIconText}>{flash ? '⚡' : '🔦'}</Text>
        </Pressable>

        {/* Brand pill — Stitch: "MOMENTS" text center */}
        <View style={styles.brandPill}>
          <Text style={styles.brandText}>MOMENTS</Text>
        </View>

        {/* Close / back */}
        <Pressable
          onPress={() => router.navigate('/feed')}
          style={styles.topIconBtn}
        >
          <Text style={styles.topIconText}>✕</Text>
        </Pressable>
      </View>

      {/* ── Bottom UI area (Stitch: bg-gradient-to-t from-black/40 to-transparent) ── */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.bottomArea,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        {/* Mode Toggle (Stitch: VIDEO | ẢNH* | CẬP NHẬT) */}
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => {
              setActiveMode('video');
              camera.toggleMode();
            }}
            style={styles.modeBtn}
          >
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 'video' && styles.modeBtnActive,
              ]}
            >
              VIDEO
            </Text>
            {activeMode === 'video' && <View style={styles.modeDot} />}
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveMode('photo');
              if (camera.mode !== 'photo') camera.toggleMode();
            }}
            style={styles.modeBtn}
          >
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 'photo' && styles.modeBtnActive,
              ]}
            >
              ẢNH
            </Text>
            {activeMode === 'photo' && <View style={styles.modeDot} />}
          </Pressable>

          <Pressable style={styles.modeBtn}>
            <Text style={styles.modeBtnText}>CẬP NHẬT</Text>
          </Pressable>
        </View>

        {/* Main Capture Cluster (Stitch: gallery | shutter | flip) */}
        <View style={styles.captureCluster}>
          {/* Gallery preview (rounded square) */}
          <Pressable style={styles.galleryPreview}>
            <View style={styles.galleryPlaceholder}>
              <Text style={{ fontSize: 20 }}>🖼️</Text>
            </View>
          </Pressable>

          {/* Shutter button — Stitch exact:
              outer: w-24 h-24 border-[3px] border-white/90 shutter-glow
              inner: w-20 h-20 bg-primary-container + transparent inner div */}
          <Pressable
            onPress={
              camera.mode === 'photo' ? camera.takePicture : camera.startRecording
            }
            onLongPress={camera.startRecording}
            style={({ pressed }) => [
              styles.shutterOuter,
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <View style={styles.shutterInner}>
              <View style={styles.shutterCore} />
            </View>
          </Pressable>

          {/* Flip camera */}
          <Pressable onPress={camera.flipCamera} style={styles.flipBtn}>
            <Text style={styles.flipIcon}>🔄</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
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

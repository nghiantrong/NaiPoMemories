import { Button } from '@/components/ui/Button';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
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
import { styles } from './CameraView.styles';

// ─── Camera UI (matches Stitch Máy ảnh screen exactly) ───────────────────────
export function CameraView() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const camera = useCamera();
  const { createPost, isLoading: isPosting, uploadProgress } = useCreatePost();
  const [caption, setCaption] = useState('');
  const [flash, setFlash] = useState(false);

  const player = useVideoPlayer(
    camera.capturedMedia?.type === 'video' ? camera.capturedMedia.uri : null,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

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
        {camera.capturedMedia.type === 'video' ? (
          <VideoView
            player={player}
            style={styles.preview}
            contentFit="cover"
          />
        ) : (
          <Image
            source={{ uri: camera.capturedMedia.uri }}
            style={styles.preview}
            resizeMode="cover"
          />
        )}
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
        mode={camera.mode === 'photo' ? 'picture' : 'video'}
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
        {/* Mode Toggle (Stitch: VIDEO | ẢNH | CẬP NHẬT) */}
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => {
              if (camera.mode !== 'video') camera.toggleMode();
            }}
            style={styles.modeBtn}
          >
            <Text
              style={[
                styles.modeBtnText,
                camera.mode === 'video' && styles.modeBtnActive,
              ]}
            >
              VIDEO
            </Text>
            {camera.mode === 'video' && <View style={styles.modeDot} />}
          </Pressable>

          <Pressable
            onPress={() => {
              if (camera.mode !== 'photo') camera.toggleMode();
            }}
            style={styles.modeBtn}
          >
            <Text
              style={[
                styles.modeBtnText,
                camera.mode === 'photo' && styles.modeBtnActive,
              ]}
            >
              ẢNH
            </Text>
            {camera.mode === 'photo' && <View style={styles.modeDot} />}
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
            onPress={() => {
              if (camera.mode === 'photo') {
                camera.takePicture();
              } else {
                if (camera.isRecording) {
                  camera.stopRecording();
                } else {
                  camera.startRecording();
                }
              }
            }}
            onLongPress={camera.mode === 'photo' ? camera.startRecording : undefined}
            style={({ pressed }) => [
              styles.shutterOuter,
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <View
              style={[
                styles.shutterInner,
                camera.mode === 'video' && { backgroundColor: colors.error }, // Red for video
                camera.isRecording && { borderRadius: 12, transform: [{ scale: 0.5 }] }, // Square stop button when recording
              ]}
            >
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

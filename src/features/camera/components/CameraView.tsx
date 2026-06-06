import { Button } from '@/components/ui/Button';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CameraView as ExpoCameraView } from 'expo-camera';
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
import { useCamera } from '../hooks/useCamera';
import { CaptureButton } from './CaptureButton';

export function CameraView() {
  const { user } = useAuthStore();
  const camera = useCamera();
  const { createPost, isLoading: isPosting, uploadProgress } = useCreatePost();
  const [caption, setCaption] = useState('');

  // ─── Permissions screen ──────────────────────────────────────────────────────
  if (!camera.hasPermissions) {
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionsTitle}>Camera Access Required</Text>
        <Text style={styles.permissionsText}>
          NaiPoMemories needs access to your camera and microphone to capture
          photos and videos.
        </Text>
        <Button label="Grant Permission" onPress={camera.requestPermissions} />
      </View>
    );
  }

  // ─── Preview screen ───────────────────────────────────────────────────────────
  if (camera.capturedMedia) {
    const isVideo = camera.capturedMedia.type === 'video';

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
        Alert.alert('Error', 'Failed to share. Please try again.');
      }
    };

    return (
      <View style={styles.previewContainer}>
        {/* Preview */}
        <Image
          source={{ uri: camera.capturedMedia.uri }}
          style={styles.preview}
          resizeMode="cover"
        />

        {/* Overlay controls */}
        <View style={styles.previewOverlay}>
          <View style={styles.captionRow}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
          </View>

          {uploadProgress !== null && (
            <Text style={styles.progressText}>
              Uploading... {uploadProgress}%
            </Text>
          )}

          <View style={styles.previewActions}>
            <Button
              label="Discard"
              variant="ghost"
              onPress={camera.discardMedia}
              style={styles.discardBtn}
            />
            <Button
              label="Share ✨"
              onPress={handlePost}
              isLoading={isPosting}
              style={styles.shareBtn}
            />
          </View>
        </View>
      </View>
    );
  }

  // ─── Camera viewfinder ────────────────────────────────────────────────────────
  return (
    <View style={styles.cameraContainer}>
      <ExpoCameraView
        ref={camera.cameraRef}
        style={StyleSheet.absoluteFill}
        facing={camera.facing}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mode={camera.mode as any}
      />

      {/* Top controls */}
      <View style={styles.topControls}>
        <Pressable onPress={camera.flipCamera} style={styles.controlBtn}>
          <Text style={styles.controlIcon}>🔄</Text>
        </Pressable>
        <Pressable onPress={camera.toggleMode} style={styles.controlBtn}>
          <Text style={styles.modeLabel}>
            {camera.mode === 'photo' ? '📷 PHOTO' : '🎥 VIDEO'}
          </Text>
        </Pressable>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <CaptureButton
          mode={camera.mode}
          isRecording={camera.isRecording}
          onPress={camera.takePicture}
          onLongPress={camera.startRecording}
          onPressOut={camera.stopRecording}
        />
      </View>
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
    backgroundColor: colors.black,
  },
  topControls: {
    position: 'absolute',
    top: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  controlBtn: {
    padding: spacing.sm,
    backgroundColor: colors.cameraOverlay,
    borderRadius: 24,
  },
  controlIcon: {
    fontSize: 22,
  },
  modeLabel: {
    ...typography.labelLg,
    color: colors.white,
    paddingHorizontal: spacing.sm,
  },
  bottomControls: {
    position: 'absolute',
    bottom: spacing[10],
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: colors.black,
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
    paddingBottom: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.cameraOverlay,
  },
  captionRow: {},
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
  discardBtn: {
    flex: 1,
  },
  shareBtn: {
    flex: 2,
  },
});

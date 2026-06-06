import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CameraMode } from '../types/camera.types';

interface CaptureButtonProps {
  mode: CameraMode;
  isRecording: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onPressOut?: () => void;
}

export function CaptureButton({
  mode,
  isRecording,
  onPress,
  onLongPress,
  onPressOut,
}: CaptureButtonProps) {
  return (
    <View style={styles.wrapper}>
      {mode === 'video' && isRecording && (
        <Text style={styles.recordingLabel}>● REC</Text>
      )}
      <Pressable
        style={[
          styles.outer,
          mode === 'video' && styles.outerVideo,
          isRecording && styles.outerRecording,
        ]}
        onPress={mode === 'photo' ? onPress : undefined}
        onLongPress={mode === 'video' && !isRecording ? onLongPress : undefined}
        onPressOut={mode === 'video' && isRecording ? onPressOut : undefined}
        delayLongPress={200}
      >
        <View
          style={[
            styles.inner,
            mode === 'video' && styles.innerVideo,
            isRecording && styles.innerRecording,
          ]}
        />
      </Pressable>
      <Text style={styles.hint}>
        {mode === 'photo'
          ? 'Tap to capture'
          : isRecording
          ? 'Release to stop'
          : 'Hold to record'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordingLabel: {
    ...typography.labelLg,
    color: colors.recordingRed,
    letterSpacing: 1,
  },
  outer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerVideo: {
    borderColor: colors.recordingRed,
  },
  outerRecording: {
    borderColor: colors.recordingRed,
    borderWidth: 6,
  },
  inner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  innerVideo: {
    backgroundColor: colors.recordingRed,
  },
  innerRecording: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.recordingRed,
  },
  hint: {
    ...typography.labelSm,
    color: colors.white,
    opacity: 0.8,
  },
});

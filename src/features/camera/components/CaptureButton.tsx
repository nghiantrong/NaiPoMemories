import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Animated,
} from 'react-native';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

type CameraMode = 'photo' | 'video';

interface CaptureButtonProps {
  mode: CameraMode;
  isRecording: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onPressOut: () => void;
}

export function CaptureButton({
  mode,
  isRecording,
  onPress,
  onLongPress,
  onPressOut,
}: CaptureButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
    onPressOut();
  };

  return (
    <View style={styles.wrapper}>
      {/* Pulsing glow ring — matches Stitch "shutter-glow" */}
      {!isRecording && (
        <View style={styles.glowRing} />
      )}

      <Animated.View style={[styles.outerRing, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          style={[styles.button, isRecording && styles.buttonRecording]}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Text style={styles.icon}>
              {mode === 'photo' ? '📷' : '🎥'}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  glowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    opacity: 0.2,
  },
  outerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.background,
    borderWidth: 8,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.shutterGlow,
  },
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight, // #a4c639 matcha green
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.shutterGlow,
  },
  buttonRecording: {
    backgroundColor: colors.error,
  },
  icon: {
    fontSize: 32,
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.onError,
  },
});

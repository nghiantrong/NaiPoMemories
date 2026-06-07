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
import { styles } from './CaptureButton.styles';

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

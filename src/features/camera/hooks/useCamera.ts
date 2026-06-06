import { useState, useRef, useCallback } from 'react';
import { CameraView as ExpoCameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { CameraMode, CameraFacing, CapturedMedia } from '../types/camera.types';
import { MAX_VIDEO_DURATION_SECONDS } from '@/utils/validation.utils';

export function useCamera() {
  const [mode, setMode] = useState<CameraMode>('photo');
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const cameraRef = useRef<ExpoCameraView>(null);
  const recordingStartRef = useRef<number | null>(null);

  const hasPermissions =
    cameraPermission?.granted && micPermission?.granted;

  const requestPermissions = useCallback(async () => {
    await Promise.all([requestCameraPermission(), requestMicPermission()]);
  }, [requestCameraPermission, requestMicPermission]);

  const flipCamera = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'photo' ? 'video' : 'photo'));
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.85,
      skipProcessing: false,
    });
    if (photo) {
      setCapturedMedia({
        uri: photo.uri,
        type: 'photo',
        width: photo.width,
        height: photo.height,
      });
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current || isRecording) return;
    setIsRecording(true);
    recordingStartRef.current = Date.now();

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: MAX_VIDEO_DURATION_SECONDS,
      });
      if (video) {
        const durationSeconds =
          recordingStartRef.current
            ? (Date.now() - recordingStartRef.current) / 1000
            : 0;
        setCapturedMedia({
          uri: video.uri,
          type: 'video',
          duration: durationSeconds,
        });
      }
    } finally {
      setIsRecording(false);
      recordingStartRef.current = null;
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!cameraRef.current || !isRecording) return;
    cameraRef.current.stopRecording();
  }, [isRecording]);

  const discardMedia = useCallback(() => {
    setCapturedMedia(null);
  }, []);

  return {
    // State
    mode,
    facing,
    isRecording,
    capturedMedia,
    hasPermissions,
    cameraPermission,
    micPermission,
    // Ref
    cameraRef,
    // Actions
    requestPermissions,
    flipCamera,
    toggleMode,
    takePicture,
    startRecording,
    stopRecording,
    discardMedia,
  };
}

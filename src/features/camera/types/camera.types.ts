export type CameraMode = 'photo' | 'video';
export type CameraFacing = 'front' | 'back';

export interface CapturedMedia {
  uri: string;
  type: CameraMode;
  /** Duration in seconds — only for video */
  duration?: number;
  width?: number;
  height?: number;
}
